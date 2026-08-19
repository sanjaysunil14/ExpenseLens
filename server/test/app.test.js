import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import {
  validateLogin,
  validateRegistration,
} from "../src/validators/authValidator.js";
import { validateExpense } from "../src/validators/expenseValidator.js";

test("GET / returns the API status message", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    message: "ExpenseLens API is running.",
  });
});

test("unknown routes return a JSON 404 response", async () => {
  const response = await request(app).get("/missing-route");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    success: false,
    message: "Route GET /missing-route not found",
  });
});

test("registration validator accepts valid input", () => {
  const result = validateRegistration({
    name: "Sanjay",
    email: "SANJAY@example.com",
    password: "secret123",
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.value.email, "sanjay@example.com");
});

test("login validator rejects missing password", () => {
  const result = validateLogin({
    email: "sanjay@example.com",
    password: "",
  });

  assert.equal(result.valid, false);
  assert.match(result.errors[0], /Password is required/);
});

test("expense validator rejects invalid payload", () => {
  const result = validateExpense({
    merchant: "A",
    amount: -50,
    categoryId: "abc",
    expenseDate: "not-a-date",
    notes: "x".repeat(501),
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 5);
});
