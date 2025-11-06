
const API_BASE_URL = 'http://localhost:5000/api';

// Função para cadastrar vendedor
async function cadastrarVendedor(nome, loja) {
    try {
        const response = await fetch(`${API_BASE_URL}/vendedores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, loja })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao cadastrar vendedor');
        }
        
        const vendedor = await response.json();
        return vendedor;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar vendedor. Verifique se o servidor está rodando.');
        return null;
    }
}

// Função para cadastrar cliente
async function cadastrarCliente(nome, vendedores) { 
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify({ 
                nome, 
                vendedores: vendedores.map(id => parseInt(id))
            })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao cadastrar cliente');
        }
        
        const cliente = await response.json();
        return cliente;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar cliente. Verifique se o servidor está rodando.');
        return null;
    }
}
// Função para obter vendedores
async function obterVendedores() {
    try {
        const response = await fetch(`${API_BASE_URL}/vendedores`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar vendedores');
        }
        
        const vendedores = await response.json();
        return vendedores;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar vendedores. Verifique se o servidor está rodando.');
        return [];
    }
}

// Função para obter clientes com dados do vendedor
async function obterClientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar clientes');
        }
        
        const clientes = await response.json();
        return clientes;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar clientes. Verifique se o servidor está rodando.');
        return [];
    }
}

// Função para popular checkboxes de vendedores
async function popularSelectVendedores() {
    const vendedores = await obterVendedores();
    const container = document.getElementById('vendedores-checkboxes'); // ID para checkboxes
    if (container) {
        if (vendedores.length === 0) {
            container.innerHTML = '<p>Nenhum vendedor cadastrado</p>';
        } else {
            container.innerHTML = '';
            vendedores.forEach(v => {
                container.innerHTML += `
                    <div class="checkbox-item">
                        <input type="checkbox" id="vendedor_${v.codigo}" name="vendedor" value="${v.codigo}">
                        <label for="vendedor_${v.codigo}">${v.nome} - ${v.loja}</label>
                    </div>
                `;
            });
        }
    }
}


// Função para exibir vendedores na página principal
async function mostrarVendedores() {
    const resultados = document.getElementById('resultados');
    if (!resultados) return;
    
    resultados.innerHTML = '<p class="loading">Carregando vendedores...</p>';
    
    const vendedores = await obterVendedores();
    
    let html = '<h3>Vendedores</h3>';
    
    if (vendedores.length === 0) {
        html += '<p>Nenhum vendedor cadastrado</p>';
    } else {
        html += '<table><tr><th>Código</th><th>Nome</th><th>Loja</th></tr>';
        vendedores.forEach(v => {
            html += `<tr><td>${v.codigo}</td><td>${v.nome}</td><td>${v.loja}</td></tr>`;
        });
        html += '</table>';
    }
    
    resultados.innerHTML = html;
}

// Função para exibir clientes na página principal
async function mostrarClientes() {
    const resultados = document.getElementById('resultados');
    if (!resultados) return;
    
    resultados.innerHTML = '<p class="loading">Carregando clientes...</p>';
    
    const clientes = await obterClientes();
    
    let html = '<h3>Clientes</h3>';
    
    if (clientes.length === 0) {
        html += '<p>Nenhum cliente cadastrado</p>';
    } else {
        
        html += '<table><tr><th>Código</th><th>Nome</th><th>Vendedores</th><th>Lojas</th></tr>';
        clientes.forEach(c => {
            html += `<tr><td>${c.codigo}</td><td>${c.nome}</td><td>${c.vendedores || 'N/A'}</td><td>${c.lojas || 'N/A'}</td></tr>`;
        });
        html += '</table>';
    }
    
    resultados.innerHTML = html;
}

// Função para carregar dados baseado no filtro
async function carregarDados() {
    const tipoFiltro = document.getElementById('tipoFiltro');
    if (!tipoFiltro) return;
    
    const tipo = tipoFiltro.value;
    
    if (tipo === 'vendedores') {
        await mostrarVendedores();
    } else {
        await mostrarClientes();
    }
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema conectado ao banco de dados PostgreSQL via Flask API');
    
    // Carregar dados na página principal
    if (document.getElementById('resultados')) {
        carregarDados();
    }
    
    // Popular checkboxes de vendedores na página de cadastro de cliente
    if (document.getElementById('vendedores-checkboxes')) {
        popularSelectVendedores();
    }
});