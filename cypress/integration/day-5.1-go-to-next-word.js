/// <reference types="Cypress" />

/**
 * @abstract:See button for next word
 *
 * @criteria
  When viewing feedback for an answer on the learning page as a logged in user:
  - I'm presented with a button that I can click to learn another word
  - When clicking on the button I see the next word to learn
*/
describe(`User story: Go to next word`, function() {
  beforeEach(() => {
    cy.server()
      .route({
        method: 'GET',
        url: `/api/language/head`,
        status: 200,
        response: 'fixture:language-head.json',
      })
      .as('languageHeadRequest')
      .route({
        method: 'POST',
        url: `/api/language/guess`,
        status: 200,
        response: 'fixture:language-guess-generic.json',
      })
      .as('postListGuess')

    cy.login().visit(`/learn`).wait('@languageHeadRequest')
    cy.get('input#CheckAnswer').type('anything')
    cy.get('form').submit().wait('@postListGuess')
  })

  it(`displays another word after clicking the 'next' button`, () => {
    cy.get('.NextButton').click()

    cy.fixture('language-guess-generic.json')
      .then(languageHeadFixture => {
        cy.get('section').within($section => {
          cy.get('h3').eq(0)
            .should(
              'have.text',
              `Total Score: `,
            )
          cy.get('.MinionTranslateTitle')
            .should('have.text', 'Minionese Word to Translate')
        })
      })

    cy.get('main form').within($form => {
      cy.get('input#CheckAnswer')
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'required', 'required')

      cy.get('button[type=submit]')
        .should('have.text', 'Was I Right?!')
    })
  })
})
