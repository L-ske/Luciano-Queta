document.addEventListener('DOMContentLoaded', () => {

    if (!localStorage.getItem('eventos')) {
        const eventosIniciais = [{
                id: Date.now(),
                nome: "Concerto de Musica",
                data: "2024-07-20",
                hora: "20:00",
                local: "Arena Musical",
                descricao: "Venha curtir o melhor do musica com várias bandas incríveis!",
                foto: "rock_concert.jpg"
            },
            {
                id: Date.now() + 1,
                nome: "Festival de Comida",
                data: "2024-08-15",
                hora: "12:00",
                local: "Parque Central",
                descricao: "Um dia inteiro de delícias gastronômicas para todos os gostos.",
                foto: "food_festival.jpg"
            },
            {
                id: Date.now() + 2,
                nome: "Palestra de Tecnologia",
                data: "2024-09-10",
                hora: "10:00",
                local: "Centro de Convenções",
                descricao: "Saiba mais sobre as últimas tendências em tecnologia.",
                foto: "tech_talk.jpg"
            }
        ];
        localStorage.setItem('eventos', JSON.stringify(eventosIniciais));

    }

    carregarEventos();
    carregarReservas();
    mostrarPagina('eventos');
});

function mostrarPagina(paginaId) {
    const paginas = document.querySelectorAll('.pagina');
    paginas.forEach(pagina => {
        pagina.style.display = 'none';
    });
    document.getElementById(paginaId).style.display = 'block';
}

function carregarEventos() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const eventosContainer = document.getElementById('eventos-lista');
    eventosContainer.innerHTML = '';

    eventos.forEach(evento => {
        const eventoDiv = document.createElement('div');
        eventoDiv.className = 'evento';
        eventoDiv.dataset.eventoId = evento.id;
        eventoDiv.innerHTML = `
            <img src="${evento.foto}" alt="${evento.nome}">
            <div>
                <h3>${evento.nome}</h3>
                <p>Data: ${evento.data}</p>
                <p>Hora: ${evento.hora}</p>
                <p>Local: ${evento.local}</p>
                <p>Descrição: ${evento.descricao}</p>
                <button onclick="mostrarDetalhesEvento(${evento.id})">Ver Detalhes</button>
                <button onclick="eliminarEvento(${evento.id})">Excluir Evento</button>
                <button onclick="marcarEventoPassado(${evento.id})">Evento Passado</button>
            </div>
        `;
        eventosContainer.appendChild(eventoDiv);
    });
}

function carregarReservas() {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const reservasContainer = document.getElementById('reservas-lista');
    reservasContainer.innerHTML = '';

    reservas.forEach(reserva => {
        const reservaDiv = document.createElement('div');
        reservaDiv.className = 'reserva';
        reservaDiv.innerHTML = `
            <h3>${reserva.eventoNome}</h3>
            <p>Nome: ${reserva.nome}</p>
            <p>Email: ${reserva.email}</p>
            <button onclick="cancelarReserva(${reserva.id})">Cancelar Reserva</button>
        `;
        reservasContainer.appendChild(reservaDiv);
    });
}

function mostrarDetalhesEvento(eventoId) {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const evento = eventos.find(ev => ev.id === eventoId);
    const detalhesEvento = document.getElementById('detalhesEvento');
    detalhesEvento.dataset.eventoId = evento.id;
    detalhesEvento.querySelector('#detalhesImagem').src = evento.foto;
    detalhesEvento.querySelector('#detalhesNome').innerText = evento.nome;
    detalhesEvento.querySelector('#detalhesData').innerText = `Data: ${evento.data}`;
    detalhesEvento.querySelector('#detalhesHora').innerText = `Hora: ${evento.hora}`;
    detalhesEvento.querySelector('#detalhesLocal').innerText = `Local: ${evento.local}`;
    detalhesEvento.querySelector('#detalhesDescricao').innerText = evento.descricao;
    carregarComentarios(eventoId);
    mostrarPagina('detalhesEvento');
}

function fazerReserva(event) {
    event.preventDefault();
    const eventoId = document.querySelector('#detalhesEvento').dataset.eventoId;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const reserva = {
        id: Date.now(),
        eventoId: eventoId,
        eventoNome: document.getElementById('detalhesNome').innerText,
        nome: nome,
        email: email
    };
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    alert('Reserva feita com sucesso!');
    carregarReservas();
    mostrarPagina('reservas');
}

function cancelarReserva(reservaId) {
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas = reservas.filter(reserva => reserva.id !== reservaId);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    alert('Reserva cancelada com sucesso!');
    carregarReservas();
}

function cadastrarEvento(event) {
    event.preventDefault();
    const nome = document.getElementById('evento-nome').value;
    const data = document.getElementById('evento-data').value;
    const hora = document.getElementById('evento-hora').value;
    const local = document.getElementById('evento-local').value;
    const descricao = document.getElementById('evento-descricao').value;
    const foto = document.getElementById('evento-foto').value;
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const evento = {
        id: Date.now(),
        nome: nome,
        data: data,
        hora: hora,
        local: local,
        descricao: descricao,
        foto: foto
    };
    eventos.push(evento);
    localStorage.setItem('eventos', JSON.stringify(eventos));
    alert('Evento cadastrado com sucesso!');
    carregarEventos();
    mostrarPagina('eventos');
}

function eliminarEvento(eventoId) {
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    eventos = eventos.filter(evento => evento.id !== eventoId);
    localStorage.setItem('eventos', JSON.stringify(eventos));
    alert('Evento excluído com sucesso!');
    carregarEventos();
}

window.marcarComoPassado = function(id) {
    eventos = eventos.map(evento => {
        if (evento.id === id) {
            evento.passado = !evento.passado;
        }
        return evento;
    });
    localStorage.setItem('eventos', JSON.stringify(eventos));
    carregarEventos();
};

function adicionarComentario(event) {
    event.preventDefault();
    const eventoId = document.querySelector('#detalhesEvento').dataset.eventoId;
    const comentarioTexto = document.getElementById('comentario').value;
    const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
    const comentario = {
        id: Date.now(),
        eventoId: eventoId,
        texto: comentarioTexto
    };
    comentarios.push(comentario);
    localStorage.setItem('comentarios', JSON.stringify(comentarios));
    alert('Comentário adicionado com sucesso!');
    mostrarDetalhesEvento(eventoId);
}

function carregarComentarios(eventoId) {
    const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
    const comentariosEvento = comentarios.filter(comentario => comentario.eventoId === eventoId);
    const comentariosContainer = document.getElementById('comentarios-lista');
    comentariosContainer.innerHTML = '';

    comentariosEvento.forEach(comentario => {
        const comentarioDiv = document.createElement('div');
        comentarioDiv.className = 'comentario';
        comentarioDiv.innerText = comentario.texto;
        comentariosContainer.appendChild(comentarioDiv);
    });
}

function adicionarReacao(tipo) {
    const eventoId = document.querySelector('#detalhesEvento').dataset.eventoId;
    const reacoes = JSON.parse(localStorage.getItem('reacoes')) || [];
    const reacao = {
        id: Date.now(),
        eventoId: eventoId,
        tipo: tipo
    };
    reacoes.push(reacao);
    localStorage.setItem('reacoes', JSON.stringify(reacoes));
    alert(`Reação "${tipo}" adicionada com sucesso!`);
}