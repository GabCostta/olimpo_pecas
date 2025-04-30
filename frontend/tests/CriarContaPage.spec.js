import { test, expect } from '@playwright/test';

test.describe('Login - Testes de autenticação', () => {
  
  test('Login com credenciais válidas', async ({ page }) => {
  // Navegar para a página de login
  await page.goto('http://localhost:5173/Login');
  
  // Configurar listener para o diálogo de sucesso
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Login realizado com sucesso!');
    await dialog.accept();
  });
  
  // Preencher o formulário de login
  await page.fill('input[type="email"]', 'aluno3@teste.com');
  await page.fill('input[type="password"]', '123456');

  // Submeter o formulário
  await page.click('button[type="button"]');
  
  // Verificar se a URL foi alterada para a página inicial
  await expect(page).toHaveURL('http://localhost:5173/');
  });

});

  test('Login com senha incorreta', async ({ page }) => {
    await page.goto('http://localhost:5173/Login');
    await page.fill('input[type="email"]', 'aluno3@teste.com');
    await page.fill('input[type="password"]', 'senhaIncorreta');
    await page.click('button[type="button"]');
    await expect(page.locator('.erro')).toHaveText('Firebase: Error (auth/invalid-credential).');
  });

  test('Login com email inexistente', async ({ page }) => {
    await page.goto('http://localhost:5173/Login');
    await page.fill('input[type="email"]', 'naoexiste@teste.com');
    await page.fill('input[type="password"]', 'qualquerSenha');
    await page.click('button[type="button"]');
    await expect(page.locator('.erro')).toHaveText('Firebase: Error (auth/invalid-credential).');
  });

  test('Email mal formatado', async ({ page }) => {
    await page.goto('http://localhost:5173/Login');
    await page.fill('input[type="email"]', 'usuario@');
    await page.fill('input[type="password"]', '');
    await page.click('button[type="button"]');
    await expect(page.locator('.erro')).toHaveText('Firebase: Error (auth/invalid-email).');
  });

  test('Senha vazia', async ({ page }) => {
    await page.goto('http://localhost:5173/Login');
    await page.fill('input[type="email"]', 'aluno3@teste.com');
    await page.fill('input[type="password"]', '');
    await page.click('button[type="button"]');
    await expect(page.locator('.erro')).toHaveText('Firebase: Error (auth/missing-password).');
  });

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
