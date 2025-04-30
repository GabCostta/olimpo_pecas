import { test, expect } from '@playwright/test';

test.describe('Login - Testes de autenticação', () => {
  
  test('Login com credenciais válidas', async ({ page }) => {
  await page.goto('http://localhost:5173/Login');
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Login realizado com sucesso!');
    await dialog.accept();
  });
  await page.fill('input[type="email"]', 'aluno3@teste.com');
  await page.fill('input[type="password"]', '123456');
  await page.click('button[type="button"]');
  await expect(page).toHaveURL('http://localhost:5173/');
  // await expect(page.locator('h1')).toHaveText('Bem-vindo');
  });

  // test('Login com senha incorreta', async ({ page }) => {
  // await page.goto('https://example.com/login');
  // await page.fill('input[name="email"]', 'usuario@exemplo.com');
  // await page.fill('input[name="password"]', 'senhaIncorreta');
  // await page.click('button[type="submit"]');
  // await expect(page.locator('.erro')).toHaveText('Senha incorreta');
  // });

  // test('Login com email inexistente', async ({ page }) => {
  // await page.goto('https://example.com/login');
  // await page.fill('input[name="email"]', 'naoexiste@exemplo.com');
  // await page.fill('input[name="password"]', 'qualquerSenha');
  // await page.click('button[type="submit"]');
  // await expect(page.locator('.erro')).toHaveText('Usuário não encontrado');
  // });

  // test('Email mal formatado', async ({ page }) => {
  // await page.goto('https://example.com/login');
  // await page.fill('input[name="email"]', 'usuario@');
  // await page.fill('input[name="password"]', 'senha123');
  // await page.click('button[type="submit"]');
  // await expect(page.locator('.erro-email')).toHaveText('Formato de email inválido');
  // });

  // test('Senha vazia', async ({ page }) => {
  // await page.goto('https://example.com/login');
  // await page.fill('input[name="email"]', 'usuario@exemplo.com');
  // await page.fill('input[name="password"]', '');
  // await page.click('button[type="submit"]');
  // await expect(page.locator('.erro-senha')).toHaveText('Senha é obrigatória');
  // });

  // test('Email e senha vazios', async ({ page }) => {
  // await page.goto('https://example.com/login');
  // await page.click('button[type="submit"]');
  // await expect(page.locator('.erro-email')).toHaveText('Email é obrigatório');
  // await expect(page.locator('.erro-senha')).toHaveText('Senha é obrigatória');
  // });

  // test('Mensagem de erro some após correção', async ({ page }) => {
  // await page.goto('https://example.com/login');
  // await page.click('button[type="submit"]');
  // await expect(page.locator('.erro-email')).toBeVisible();

  // await page.fill('input[name="email"]', 'usuario@exemplo.com');
  // await page.fill('input[name="password"]', 'senhaSegura123');
  // await page.click('button[type="submit"]');
  // await page.waitForURL('https://example.com/dashboard');

  // await expect(page.locator('.erro-email')).toHaveCount(0);
  // });

});