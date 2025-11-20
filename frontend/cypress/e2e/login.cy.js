describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays the login form', () => {
    cy.get('h1').should('contain', 'User Sign In');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Sign In as User');
  });

  it('shows error with invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Wait for error message
    cy.get('.MuiAlert-root').should('be.visible');
  });

  it('navigates to registration page', () => {
    cy.contains('Create Account').click();
    cy.url().should('include', '/register');
  });

  it('navigates to professional login page', () => {
    cy.contains('Professional Login').click();
    cy.url().should('include', '/login/professional');
  });
});