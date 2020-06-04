new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        partidaEnCurso: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.partidaEnCurso = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.turnos = [];
        },
        ataque: function () {
            var danio = this.calcularDanio(this.rangoAtaque);
            if(this.saludMonstruo - danio < 0){
                danio = this.saludMonstruo;
                this.saludMonstruo = 0;
            } else {
                this.saludMonstruo -= danio;
            }
            this.turnos.unshift({
                esJugador: true,
                text: 'Ataque al monstruo por ' + danio + '%'
            });
            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            var danio = this.calcularDanio(this.rangoAtaqueEspecial);
            if(this.saludMonstruo - danio < 0){
                danio = this.saludMonstruo;
                this.saludMonstruo = 0;
            } else {
                this.saludMonstruo -= danio;
            }
            let evento = {
                esJugador: true,
                text: 'Ataque especial al monstruo por ' + danio + '%'
            }
            this.registrarEvento(evento)
            if(this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        curacion: function () {
            const CURACION = 10;
            let curacionActual = CURACION;
            this.ataqueDelMonstruo();
            if(this.saludJugador > 90) {
                curacionActual = 100 - this.saludJugador;
            }
            this.saludJugador += curacionActual;
            let evento = {
                esJugador: true,
                text: 'Curacion por ' + curacionActual + '%',
            }
            this.registrarEvento(evento);
            
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento);
        },
        terminarPartida: function () {
            this.partidaEnCurso = false;
        },

        ataqueDelMonstruo: function () {
            let danio = this.calcularDanio(this.rangoAtaqueDelMonstruo);
            if(this.saludJugador - danio < 0){
                danio = this.saludJugador;
                this.saludJugador = 0;
            } else {
                this.saludJugador -= danio;
            }
            let evento = {
                esJugador: false,
                text: 'Ataque del monstruo por ' + danio + '%'
            }
            this.registrarEvento(evento);
            this.verificarGanador();
        },

        calcularDanio: function (rango) {
            let min = rango[0]
            let max = rango[1]
            return Math.max(Math.floor(Math.random() * max) + 1, min);

        },
        verificarGanador: function () {
            if (this.saludMonstruo == 0) {
                if (confirm('Ganaste! Deseas jugar otra vez?')) {
                    this.empezarPartida();
                } else {
                    this.partidaEnCurso = false;
                }
                return true;
            } else if (this.saludJugador == 0) {
                if (confirm('Perdiste! Deseas jugar otra vez?')) {
                    this.empezarPartida();
                } else{
                    this.terminarPartida()
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});