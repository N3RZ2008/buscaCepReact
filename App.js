import React, { useState, useEffect } from 'react';

function BuscaCEP() {
    const [cep, setCep] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [rua, setRua] = useState('');
    const [bairro, setBairro] = useState('');
    const [message, setMessage] = useState('BuscaCEP');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        renderHistory();
    }, []);

    const buscaEndereco = async (cep, goToHistory) => {
        try {
            if (!/^[0-9]{8}$/.test(cep)) {
                throw new Error("CEP Inválido");
            }

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
            if (!response.ok) throw new Error("Erro na busca");

            const data = await response.json();
            if (data.erro) throw new Error("CEP não existente");

            setRua(data.logradouro);
            setBairro(data.bairro);
            setCidade(data.localidade);
            setEstado(data.uf);

            if (goToHistory) {
                addHistory(cep);
                renderHistory();
            }
        } catch (error) {
            setMessage(error.message);
            setTimeout(() => setMessage("BuscaCEP"), 5000);
        }
    };

    const addHistory = (info) => {
        const updatedHistory = [...history, info];
        setHistory(updatedHistory);
        localStorage.setItem('history', JSON.stringify(updatedHistory));
    };

    const renderHistory = () => {
        const savedHistory = JSON.parse(localStorage.getItem('history') || '[]');
        setHistory(savedHistory);
    };

    const reset = () => {
        localStorage.clear();
        setHistory([]);
    };

    return (
        <div className="main">
            <div className="header">
                <div className="nav" onClick={() => window.location.href = '#'}>
                    <a href="#">Buscar Endereço pelo CEP</a>
                </div>
                <div className="nav" onClick={() => window.location.href = 'busca_cep.html'}>
                    <a href="busca_cep.html">Buscar CEP pelo Endereço</a>
                </div>
            </div>

            <h1 id="message">{message}</h1>
            <div className="infos">
                <div className="info">Rua: {rua}</div>
                <div className="info">Bairro: {bairro}</div>
                <div className="info">Cidade: {cidade}</div>
                <div className="info">Estado: {estado}</div>
            </div>

            <div className="search">
                <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="Digite o CEP"
                />
                <button onClick={() => buscaEndereco(cep, true)}>Buscar Endereço pelo CEP</button>
            </div>

            <div className="history">
                <h2>Histórico de Pesquisas</h2>
                <button onClick={reset}>Limpar Histórico</button>
                <div className="hResults">
                    {history.map((item, index) => (
                        <button key={index} onClick={() => buscaEndereco(item, false)}>
                            {index + 1}. {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BuscaCEP;