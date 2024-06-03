describe("Test Exercise 1 Page", () => {
  let markLeft = 0;
  let markValue = "";
  let rangeStart = 0;
  let rangeEnd = 0;

  before(() => {
    cy.visit("http://localhost:8080/exercise1");

    cy.get("*[class^='rangerail_rail']")
      .last()
      .then((el) => {
        const { left, width } = el[0].getBoundingClientRect();
        markLeft = left + (width / 3) * 2;

        rangeStart = left;
        rangeEnd = left + width;

        cy.get("*[class^='rangethumb_thumb']")
          .first()
          .trigger("mousedown", { button: 0, force: true })
          .trigger("mousemove", {
            clientX: markLeft,
            clientY: 0,
            force: true,
          })
          .trigger("mouseup", { force: true });

        cy.wait(200);

        cy.get("input")
          .first()
          .then((el) => {
            markValue = el[0].value;
          });

        cy.log(markValue);
      });
  });

  it("loads correctly", () => {
    cy.visit("http://localhost:8080/exercise1");
  });

  it("loads a slider", () => {
    cy.visit("http://localhost:8080/exercise1");

    cy.get("*[role='slider']").first().should("exist");
  });

  it("set the min dragging", () => {
    cy.visit("http://localhost:8080/exercise1");

    cy.get("*[class^='rangethumb_thumb']")
      .first()
      .trigger("mousedown", { button: 0, force: true })
      .trigger("mousemove", {
        clientX: markLeft,
        clientY: 0,
        force: true,
      })
      .trigger("mouseup", { force: true });

    cy.get("input").first().should("have.value", markValue);
  });

  it("set the max dragging", () => {
    cy.visit("http://localhost:8080/exercise1");

    cy.get("*[class^='rangethumb_thumb']")
      .last()
      .trigger("mousedown", { button: 0, force: true })
      .trigger("mousemove", {
        clientX: markLeft,
        clientY: 0,
        force: true,
      })
      .trigger("mouseup", { force: true });

    cy.get("input").last().should("have.value", markValue);
  });

  it("min and max unable to cross", () => {
    cy.visit("http://localhost:8080/exercise1");

    cy.get("*[class^='rangethumb_thumb']")
      .first()
      .trigger("mousedown", { button: 0, force: true })
      .trigger("mousemove", {
        clientX: markLeft,
        clientY: 0,
        force: true,
      })
      .trigger("mouseup", { force: true });

    cy.get("input").first().should("have.value", markValue);

    cy.get("*[class^='rangethumb_thumb']")
      .last()
      .trigger("mousedown", { button: 0, force: true })
      .trigger("mousemove", {
        clientX: rangeStart,
        clientY: 0,
        force: true,
      })
      .trigger("mouseup", { force: true });

    cy.get("input").last().should("have.value", markValue);
  });
});
