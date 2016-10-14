(function (window, document, undefined) {

  (function () {
    return algoritmo = {
      table_body: document.getElementById('table_fifo'),
      tabla: document.getElementById('tabla'),
      tipoAlgoritmo: document.getElementById('algoritmo'),
      agregarFila: document.getElementById('agregar'),
      table_entradas: document.getElementById('table_entradas'),
      tabla_calculos: document.getElementById('tabla_calculos'),
      numProcesos: 1,
      arrayProcesor: new Array(),
      arrayCola: new Array(),
      arrayES: new Array(),
      arrayFinProcesos: new Array(),
      procesoTiempoCero: 0,
      procesoLlegadaCero: 0,
      acumuladorTiempoEspera: 0,
      acumuladorTiempoRespuesta: 0,
      numEntra: 0,
      quantum: 100,
      intercambio: 20,
      numIteraciones: 0,
      numProcesoCola: 0,
      lastCurrent: {},
      posCola: 0,
      ejeX: 10,
      ejeY: 70,
      ejeXProcesador: 10,
      ejeYProcesador: 80,
      quantumProcesador: 30,
      procesoProcesador: 30,
      tiempoProcesador: 5,
      textoTiempoProceso: 0,
      acumuladorRetorno: 0,
      acumuladorEspera: 0,
      quantum: 30,
      procesoC: 25,
      avanceX: 12,
      currentNumber: 0,
      textoProceso: "",
      textoQuantum: "",

      Init: function () {
        this.escucharTipoAlgoritmo()
      },

      escucharTipoAlgoritmo: function () {
        var self = this
        self.tipoAlgoritmo.addEventListener('change', function (evt) {
          if (self.tipoAlgoritmo.value != "0") {
            switch (self.tipoAlgoritmo.value) {
              case "1":
                self.numProcesos = 0
                self.tabla.innerHTML = ""
                self.tabla.innerHTML = self.tablaFifo()
                self.numProcesos = self.numProcesos + 1
                self.agregarFila(document.getElementById('table_fifo'), document.getElementById('agregar'), 'Fifo')
                self.ejecutarAlgoritmo(document.getElementById('ejecutarFifo'), 'Fifo')
                break;
              case "2":
                self.arrayProcesor = new Array()
                self.numProcesos = 0
                self.tabla.innerHTML = ""
                self.tabla.innerHTML = self.tablaRoundRobin()
                self.numProcesos = self.numProcesos + 1
                self.numEntra = self.numEntra + 1
                self.agregarFila(document.getElementById('table_round_robin'), document.getElementById('agregarEntradas'), 'RoundRobin')
                self.ejecutarAlgoritmo(document.getElementById('ejecutarFifo'), 'RounRobin')
                break;
              case "3":
                console.log('funciona 3')
                break;
              case "4":
                console.log('funciona 4')
                break;
              default:
                console.log('Seleccione una opcion')
                break;
            }
          }
        })
      },

      dibujarDiagramaGrant: function () {
        canvas = document.getElementById('canvas_procesador')
        lienzo = canvas.getContext('2d')
        lienzo.font = "bold 16px sans-serif"
        lienzo.beginPath()
        lienzo.moveTo(this.ejeXProcesador, this.ejeYProcesador)
        lienzo.lineTo(998,this.ejeYProcesador);
        lienzo.lineTo(998,(this.ejeYProcesador - 50));
        lienzo.lineTo(this.ejeXProcesador,(this.ejeYProcesador - 50));
        lienzo.lineTo(this.ejeXProcesador,this.ejeYProcesador);
        lienzo.fillText(this.currentNumber,this.tiempoProcesador,(this.ejeYProcesador - 55))
        lienzo.stroke()
        lienzo.closePath()
      },

      dibujarProceso: function (){
        canvas = document.getElementById('canvas_procesador')
        lienzo = canvas.getContext('2d')
        lienzo.font = "bold 18px sans-serif"
        lienzo.beginPath()
        lienzo.moveTo((this.ejeXProcesador + 80),this.ejeYProcesador)
        lienzo.lineTo((this.ejeXProcesador + 80),(this.ejeYProcesador - 50))
        lienzo.fillText(this.textoProceso,this.procesoProcesador,(this.ejeYProcesador - 20))
        lienzo.stroke()
        lienzo.closePath()
        lienzo.beginPath()
        lienzo.moveTo((this.ejeXProcesador + 121),this.ejeYProcesador)
        lienzo.lineTo((this.ejeXProcesador + 121),(this.ejeYProcesador - 50))
        lienzo.stroke()
        lienzo.closePath()
        this.ejeXProcesador += 124
        this.procesoProcesador += 124
      },

      dibujarColaProcesos: function (index) {
        canvas = document.getElementById('canvas_procesos')
        lienzo = canvas.getContext('2d')
        lienzo.font = "bold 18px sans-serif"
        lienzo.beginPath()
        lienzo.moveTo(this.ejeX,this.ejeY)
        lienzo.lineTo((this.ejeX + 60),this.ejeY);
        lienzo.lineTo((this.ejeX + 60),(this.ejeY - 40));
        lienzo.lineTo(this.ejeX,(this.ejeY - 40));
        lienzo.lineTo(this.ejeX,this.ejeY);
        lienzo.fillText(this.textoProceso,this.procesoC,(this.ejeY - 15))

        lienzo.fillText(this.textoQuantum,this.quantum,(this.ejeY - 45))
        lienzo.stroke()
        lienzo.closePath()
        if (index != 11 || index != (this.numIteraciones - 1)){
          lienzo.beginPath()
          lienzo.moveTo((this.ejeX + 60),(this.ejeY - 20))
          lienzo.lineTo((this.ejeX + 60 + 30),(this.ejeY - 20));
          lienzo.stroke()
          lienzo.closePath()
        }
        this.ejeX += 90
        this.quantum += 90
        this.procesoC += 90
        this.textoProceso = ""
        this.textoQuantum = ""
      },

      dibujarNumerosProcesador: function (index) {
        canvas = document.getElementById('canvas_procesador')
        lienzo = canvas.getContext('2d')
        lienzo.font = "bold 16px sans-serif"
        if (index > 7){
          lienzo.fillText((this.textoTiempoProceso - 20),(this.tiempoProcesador + 65),(this.ejeYProcesador - 55))
          lienzo.fillText(this.textoTiempoProceso,(this.tiempoProcesador + 114),(this.ejeYProcesador - 55))
        }else{
          lienzo.fillText((this.textoTiempoProceso - 20),(this.tiempoProcesador + 70),(this.ejeYProcesador - 55))
          lienzo.fillText(this.textoTiempoProceso,(this.tiempoProcesador + 111),(this.ejeYProcesador - 55))
        }
        this.tiempoProcesador = this.tiempoProcesador + 111 + this.avanceX
        this.textoTiempoProceso = 0
      },

      ordenarProcesos: function () {
        this.arrayProcesor.sort(function (data, data1) {
          return (data.tiempoLlegada - data1.tiempoLlegada)
        })
        console.log(this.arrayProcesor)
      },

      calcularDatos: function () {
        var self = this
        var object = {}
        this.arrayFinProcesos.sort(function (data, data1) {
          return (data.tiempoLlegada - data1.tiempoLlegada)
        })
        this.arrayFinProcesos = this.arrayFinProcesos.map(function (object) {
          object.tiempoVuelta = object.ultimaEjecucion - (object.entrada + object.entrada1) - object.tiempoLlegada
          object.tiempoEspera = object.inicioEjecucion - object.tiempoLlegada
          self.acumuladorEspera += object.tiempoEspera
          self.acumuladorRetorno += object.tiempoVuelta
          return object
        })
        object.proceso = "Promedio"
        object.tiempoVuelta = (this.acumuladorRetorno / this.numProcesos).toFixed(2)
        object.tiempoEspera = (this.acumuladorEspera / this.numProcesos).toFixed(2)
        this.arrayFinProcesos.push(object)
        this.arrayFinProcesos.map(function (object) {
          tabla_calculos.insertAdjacentHTML("beforeend",self.tablaCalculos(object));
        })
      },

      recorrerRoundRobin: function () {
        var self  = this
        while (self.posCola < self.numIteraciones) {
          if (self.arrayProcesor.length != 0){
            if (self.arrayProcesor.length === self.numProcesos){
              self.encolarProceso(self.arrayProcesor[0], 'arrayProcesor')
            }else{
              var object = self.arrayProcesor[0]
              var dato = self.arrayCola[self.posCola]
              if (object.tiempoLlegada < dato.terminarEjecucion[dato.terminarEjecucion.length - 1]){
                if (this.posCola === 0){
                  self.encolarProceso(self.arrayProcesor[0], 'arrayProcesor')
                }else{
                  var data = self.arrayCola[self.posCola]
                  if (object.tiempoLlegada < data.terminarEjecucion[data.terminarEjecucion.length - 1]){
                    self.encolarProceso(self.arrayProcesor[0], 'arrayProcesor')
                  }else{
                    self.encolarProceso(self.arrayCola[(this.posCola)], 'arrayCola')
                    self.encolarProceso(self.arrayProcesor[0], 'arrayProcesor')
                  }
                }
              }else {
                  self.encolarProceso(self.arrayCola[self.posCola], 'arrayCola')
              }
            }
          }else{
            self.encolarProceso(self.arrayCola[self.posCola], 'arrayCola')
          }
        }
      },

      encolarProceso: function (proceso, tipo) {
        if (tipo === 'arrayProcesor'){
          if (this.arrayCola.length === 0) {
            proceso.inicioEjecucion.push(0)
            proceso.terminarEjecucion.push(120)
            proceso.tiemposProcesadores.push(proceso.tiempoProcesador)
            this.arrayCola.push(proceso)
            this.lastCurrent = proceso
            this.arrayProcesor.shift()
          }else{
            proceso.inicioEjecucion.push(this.lastCurrent.terminarEjecucion[this.lastCurrent.terminarEjecucion.length - 1])
            proceso.terminarEjecucion.push((this.lastCurrent.terminarEjecucion[this.lastCurrent.terminarEjecucion.length - 1] + 120))
            proceso.tiemposProcesadores.push(proceso.tiempoProcesador)
            this.arrayCola.push(proceso)
            this.lastCurrent = proceso
            this.arrayProcesor.shift()
          }
        }else if (tipo === 'arrayCola') {
          if (proceso.ejecucionEntrada === 0){
            this.validacionesProceso(proceso, 1)
          }else if (proceso.ejecucionEntrada === 1) {
            this.validacionesProceso(proceso, 2)
          }else if (proceso.ejecucionEntrada == 2){
            this.validacionesProceso(proceso, 3)
          }
        }
      },

      validacionesProceso: function (proceso, numProcesador) {
        var tiempo = 0
        var entrada = 0
        if (numProcesador === 1) {
          tiempo = proceso.tiempoProcesador
          entrada = proceso.entrada
        }else if (numProcesador === 2) {
          tiempo = proceso.tiempoProcesador1
          entrada = proceso.entrada1
        }else {
          tiempo = proceso.tiempoProcesador2
        }
        if (tiempo === 1){
          if (entrada != 0){
            if (this.arrayES.length > 0){
              this.eliminarProcesoEntrada(proceso, numProcesador, 'entradas', entrada)
            }else {
              this.encolarCargaEntradas(proceso, entrada)
            }
          }else {
            var object = {}
            object.proceso = proceso.proceso
            object.tiempoLlegada = proceso.tiempoLlegada
            object.entrada = proceso.entrada
            object.entrada1 = proceso.entrada1
            object.inicioEjecucion = proceso.inicioEjecucion[0]
            object.ultimaEjecucion = this.posCola < this.numIteraciones ? proceso.terminarEjecucion[(proceso.terminarEjecucion.length - 1)] : (proceso.terminarEjecucion[(proceso.terminarEjecucion.length - 1)]  - 20)
            this.arrayFinProcesos.push(object)
            this.eliminarProcesoSalida(proceso, numProcesador)
            this.posCola += 1
          }
        }else{
          if (this.arrayES.length > 0){
            this.eliminarProcesoEntrada(proceso, numProcesador, 'encolar', 0)
          }else {
            this.encolarProcesoFila(proceso, numProcesador)
          }
        }
      },

      encolarProcesoFila: function (proceso, numProcesador){
        proceso.inicioEjecucion.push(this.lastCurrent.terminarEjecucion[this.lastCurrent.terminarEjecucion.length - 1])
        proceso.terminarEjecucion.push((this.lastCurrent.terminarEjecucion[this.lastCurrent.terminarEjecucion.length - 1] + 120))
        if (numProcesador === 1){
          proceso.tiempoProcesador -= 1
          proceso.tiemposProcesadores.push(proceso.tiempoProcesador)
        }else if (numProcesador === 2) {
          proceso.tiempoProcesador1 -= 1
          proceso.tiemposProcesadores.push(proceso.tiempoProcesador1)
        }else {
          proceso.tiempoProcesador2 -= 1
          proceso.tiemposProcesadores.push(proceso.tiempoProcesador2)
        }
        this.arrayCola.push(proceso)
        this.posCola += 1
        this.lastCurrent = proceso
      },

      encolarCargaEntradas: function (proceso, entrada){
        proceso.regresoCargaEntradas = proceso.terminarEjecucion[proceso.terminarEjecucion.length - 1] + (entrada * 100)
        this.table_entradas.insertAdjacentHTML("beforeend",this.filaEntrada(proceso));
        proceso.ejecucionEntrada += 1
        this.arrayES.push(proceso)
        this.arrayES.sort(function (data, data1) {
          return (data.regresoCargaEntradas - data1.regresoCargaEntradas)
        })
        this.posCola += 1
      },

      eliminarProcesoEntrada: function (proceso, numProcesador, tipo, entrada) {
        var object17 = this.arrayES[0]
        var self = this
        if (object17.regresoCargaEntradas < proceso.terminarEjecucion[(proceso.terminarEjecucion.length - 1)]){
          var arrayFilter = this.arrayES.filter(function (data) {
            if (data.regresoCargaEntradas < proceso.terminarEjecucion[(proceso.terminarEjecucion.length - 1)]){
              if (data.ejecucionEntrada === 1){
                data.tiemposProcesadores.push(data.tiempoProcesador1)
              }else if (data.ejecucionEntrada === 2) {
                data.tiemposProcesadores.push(data.tiempoProcesador2)
              }
              data.inicioEjecucion.push(self.lastCurrent.terminarEjecucion[self.lastCurrent.terminarEjecucion.length - 1])
              data.terminarEjecucion.push((self.lastCurrent.terminarEjecucion[self.lastCurrent.terminarEjecucion.length - 1] + 120))
              self.arrayCola.push(data)
              self.lastCurrent = data
              return data
            }
          })
          for (var i = 0; i < arrayFilter.length; i++) {
            this.arrayES.shift()
          }
          if (tipo === 'entradas'){
            this.encolarCargaEntradas(proceso, entrada)
          }else{
            this.encolarProcesoFila(proceso, numProcesador)
          }
        }else {
          if (tipo === 'entradas'){
            this.encolarCargaEntradas(proceso, entrada)
          }else{
            this.encolarProcesoFila(proceso, numProcesador)
          }
        }
      },

      agregarFila: function (tabla_body, boton, fila) {
        var self = this
        boton.addEventListener('click', function (evt) {
          evt.preventDefault()
          switch (fila) {
            case 'Fifo':
              tabla_body.insertAdjacentHTML("beforeend",self.filaTablaFifo());
              break;
            case 'RoundRobin':
              tabla_body.insertAdjacentHTML("beforeend",self.filaRoundRobin());
              break;
            default:

          }
          self.numProcesos = self.numProcesos + 1
          self.numEntra = self.numEntra + 1
        })
      },

      soloNumeros: function soloNumeros(element){
        element.addEventListener('keypress', function (event) {
          var code = event.which
          console.log(code);
          if (code > 47 && code < 58 || code == 0){
            return true;
          }else{
            return false;
          }
        })
      },

      filaTablaFifo: function () {
        return "<tr>" +
          "<td><input type='text' id='proceso" + this.numProcesos + "'></td>" +
          "<td><input type='text' id='tllegada" + this.numProcesos + "'></td>" +
          "<td><input type='text' id='torden" + this.numProcesos + "'></td>" +
          "<td><input type='text' id='tprocesador" + this.numProcesos + "'></td>" +
          "<td></td>" +
        "</tr>"
      },

      eliminarProcesoSalida: function (proceso, numProcesador) {
        if (this.arrayES.length > 0){
          var object17 = this.arrayES[0]
          var self = this
          if (object17.regresoCargaEntradas < proceso.terminarEjecucion[(proceso.terminarEjecucion.length - 1)]){
            var arrayFilter = this.arrayES.filter(function (data) {
              if (data.regresoCargaEntradas < proceso.terminarEjecucion[(proceso.terminarEjecucion.length - 1)]){
                if (data.ejecucionEntrada === 1){
                  data.tiemposProcesadores.push(data.tiempoProcesador1)
                }else if (data.ejecucionEntrada === 2) {
                  data.tiemposProcesadores.push(data.tiempoProcesador2)
                }
                data.inicioEjecucion.push(self.lastCurrent.terminarEjecucion[self.lastCurrent.terminarEjecucion.length - 1])
                data.terminarEjecucion.push((self.lastCurrent.terminarEjecucion[self.lastCurrent.terminarEjecucion.length - 1] + 120))
                self.arrayCola.push(data)
                self.lastCurrent = data
                return data
              }
            })
            for (var i = 0; i < arrayFilter.length; i++) {
              this.arrayES.shift()
            }
          }
        }
      },

      ejecutarAlgoritmo: function (boton, algoritmo){
        var self = this
        boton.addEventListener('click', function (evt) {
          evt.preventDefault()
          switch (algoritmo) {
            case 'Fifo':
              var mensaje = self.validarObligatoriosFifo()
              console.log(mensaje)
              if (mensaje){
                alert(mensaje)
              }else{
                var object = {}
                for (var i = 1; i < self.numProcesos; i++) {
                  object.proceso = document.getElementById('proceso' + i).value
                  object.tiempoProcesador = parseInt(document.getElementById('tprocesador' + i).value)
                  if (document.getElementById('tllegada' + i).value == "" || document.getElementById('tllegada' + i).value == "0"){
                    object.tiempoLlegada = 0
                    document.getElementById('tllegada' + i).value = 0
                    self.procesoTiempoCero += 1
                  }else{
                    object.tiempoLlegada = parseInt(document.getElementById('tllegada' + i).value)
                  }
                  if (document.getElementById('torden' + i).value == "" || document.getElementById('torden' + i).value == "0"){
                    object.orden = 0
                    document.getElementById('torden' + i).value = 0
                    self.procesoLlegadaCero += 1
                  }else{
                    object.orden = parseInt(document.getElementById('torden' + i).value)
                  }
                  self.arrayProcesor.push(object)
                  object = {}
                }
                console.log(self.arrayProcesor)
                self.desactivarCampos()
                self.ordenarProcesos()
                self.calcularDatos()
              }
              break
            case 'RounRobin':
              var mensaje = self.validarObligatorisRound()
              if (mensaje){
                alert(mensaje)
              }else{
                self.cargarArrayRoundRobin()
                self.ordenarProcesos()
                self.sumarTotalProcesos()
                self.recorrerRoundRobin()
                console.log(self.arrayProcesor)
                console.log(self.numIteraciones)
                console.log(self.arrayCola)
                self.pintarCola()
                self.dibujarDiagramaGrant()
                self.pintarProcesador()
                self.calcularDatos()
              }
              break
            default:

          }
        })
      },

      sumarTotalProcesos: function () {
        var self = this
        self.arrayProcesor = self.arrayProcesor.map(function (data) {
          self.numIteraciones = self.numIteraciones + data.tiempoProcesador + data.tiempoProcesador1 + data.tiempoProcesador2
          return data
        })
      },

      sleep: function (milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds) {
            break;
          }
        }
      },

      pintarCola: function () {
        var self = this
        this.arrayCola.map(function (data, index) {
          if (index === 11){
            self.ejeY = 170
            self.ejeX = 10
            self.quantum = 30
            self.procesoC = 25
          }
          self.textoProceso = data.proceso
          self.textoQuantum = data.tiemposProcesadores.shift()
          self.dibujarColaProcesos(index)
          return data
        })
      },

      pintarProcesador: function () {
        var self = this
        this.arrayCola.map(function (data, index) {
          if (index === 8){
            self.ejeYProcesador = 170
            self.ejeXProcesador = 10
            self.tiempoProcesador = 5
            self.quantumProcesador = 30
            self.procesoProcesador = 30
            self.dibujarDiagramaGrant()
            self.avanceX = 10
          }
          self.textoProceso = data.proceso
          self.textoQuantum = data.tiemposProcesadores.shift()
          self.textoTiempoProceso = data.terminarEjecucion.shift()
          self.currentNumber = self.textoTiempoProceso
          self.dibujarProceso()
          self.dibujarNumerosProcesador(index)
          return data
        })
      },

      cargarArrayRoundRobin: function () {
        var self = this
        var object = {}
        for (var i = 0; i < self.numProcesos; i++) {
          object.proceso = document.getElementById('proceso' + i).value
          object.numEntradas = 0
          if (document.getElementById('tllegada' + i).value == "" || document.getElementById('tllegada' + i).value == "0"){
            object.tiempoLlegada = 0
            document.getElementById('tllegada' + i).value = 0
          }else{
            object.tiempoLlegada = parseInt(document.getElementById('tllegada' + i).value)
          }
          if (document.getElementById('tprocesador' + i).value == "" || document.getElementById('tprocesador' + i).value == "0"){
            object.tiempoProcesador = 0
            document.getElementById('tprocesador' + i).value = 0
          }else{
            object.tiempoProcesador = parseInt(document.getElementById('tprocesador' + i).value)
          }
          if (document.getElementById('tprocesador' + i + "_1").value == "" || document.getElementById('tprocesador' + i + "_1").value == "0"){
            object.tiempoProcesador1 = 0
            document.getElementById('tprocesador' + i + "_1").value = 0
          }else{
            object.tiempoProcesador1 = parseInt(document.getElementById('tprocesador' + i + "_1").value)
          }
          if (document.getElementById('tprocesador' + i + "_2").value == "" || document.getElementById('tprocesador' + i + "_2").value == "0"){
            object.tiempoProcesador2 = 0
            document.getElementById('tprocesador' + i + "_2").value = 0
          }else{
            object.tiempoProcesador2 = parseInt(document.getElementById('tprocesador' + i + "_2").value)
          }
          if (document.getElementById('entrada' + i).value == "" || document.getElementById('entrada' + i).value == "0"){
            object.entrada = 0
            document.getElementById('entrada' + i).value = 0
          }else{
            object.entrada = parseInt(document.getElementById('entrada' + i).value)
            object.numEntradas += 1
          }
          if (document.getElementById('entrada' + i + "_1").value == "" || document.getElementById('entrada' + i + "_1").value == "0"){
            object.entrada1 = 0
            document.getElementById('entrada' + i + "_1").value = 0
          }else{
            object.entrada1 = parseInt(document.getElementById('entrada' + i + "_1").value)
            object.numEntradas += 1
          }
          object.inicioEjecucion = new Array()
          object.terminarEjecucion = new Array()
          object.tiemposProcesadores = new Array()
          object.ejecucionEntrada = 0
          self.arrayProcesor.push(object)
          object = {}
        }
        console.log(self.arrayProcesor);;
      },

      desactivarCampos: function (){
        for (var i = 1; i < self.numProcesos; i++) {
          document.getElementById('proceso' + i).readOnly = false
          document.getElementById('tprocesador' + i).readOnly = false
          document.getElementById('tllegada' + i).readOnly = false
          document.getElementById('torden' + i).readOnly = false
        }
      },

      limpiarCampos: function (){
        for (var i = 1; i < self.numProcesos; i++) {
          document.getElementById('proceso' + i).value = ""
          document.getElementById('tprocesador' + i).value = ""
          document.getElementById('tllegada' + i).value = ""
          document.getElementById('torden' + i).value = ""
        }
      },

      validarObligatoriosFifo: function () {
        var proceso = ""
        var tiempoProcesador = ""
        for (var i = 1; i < this.numProcesos; i++) {
          if (document.getElementById('proceso' + i).value == "" || document.getElementById('tprocesador' + i).value == ""){
            proceso += "El proceso de la fila " + i + " tiene el nombre del proceso o el tiempo del procesador vacio " + "\n"
          }
        }

        if (proceso){
          return proceso
        }else{
          return ""
        }
      },

      validarObligatorisRound: function () {
        var proceso = ""
        var tiempoProcesador = ""
        for (var i = 0; i < this.numProcesos; i++) {
          if (document.getElementById('proceso' + i) == null || document.getElementById('proceso' + i).value == ""){
            proceso += "El nombre del proceso de la fila " + (i + 1) + " esta vacio " + "\n"
          }
        }

        if (proceso){
          return proceso
        }else{
          return ""
        }
      },

      tablaFifo: function () {
        return "<table>" +
          "<thead>" +
            "<tr>" +
              "<th>" +
                "Proceso" +
              "</th>" +
              "<th>" +
                "Tiempo Llegada" +
              "</th>" +
              "<th>" +
                "Orden Llegada" +
              "</th>" +
              "<th>" +
                "Tiempo de Procesador" +
              "</th>" +
            "</tr>" +
          "</thead>" +
          "<tbody id='table_fifo'>" +
            "<tr>" +
              "<td><input type='text' id='proceso" + this.numProcesos + "'></td>" +
              "<td><input type='text' id='tllegada" + this.numProcesos + "'></td>" +
              "<td><input type='text' id='torden" + this.numProcesos + "'></td>" +
              "<td><input type='text' id='tprocesador" + this.numProcesos + "'></td>" +
              "<td><input type='button' value='+' id='agregar'></td>" +
            "</tr>" +
          "</tbody>" +
        "</table>" +
        "<div class='ejecutar'>" +
          "<button type='button' name='button' id='ejecutarFifo'>Ejecutar Algoritmo</button>" +
        "</div>"
      },

      filaRoundRobin: function () {
        return "<tr>" +
          "<td><input type='text' id='proceso" + this.numProcesos + "'></td>" +
          "<td><input type='text' id='tllegada" + this.numProcesos + "'></td>" +
          "<td><input type='text' id='tprocesador" + this.numProcesos + "'></td>" +
          "<td><input type='text' id='entrada" + this.numProcesos + "'></td>" +
          "<td><input type='text' id='tprocesador" + this.numProcesos + "_1'></td>" +
          "<td><input type='text' id='entrada" + this.numProcesos + "_1'></td>" +
          "<td><input type='text' id='tprocesador" + this.numProcesos + "_2'></td>" +
          "<td></td>" +
        "</tr>"
      },

      tablaCalculos: function (object) {
        return "<tr>" +
          "<td>" + object.proceso + "</td>" +
          "<td>" + object.tiempoVuelta + "</td>" +
          "<td>" + object.tiempoEspera + "</td>" +
        "</tr>"
      },

      tablaRoundRobin: function () {
        return "<table>" +
          "<thead>" +
            "<tr>" +
              "<th>" +
                "Proceso" +
              "</th>" +
              "<th>" +
                "Tiempo Llegada" +
              "</th>" +
              "<th>" +
                "Tiempo CPU" +
              "</th>" +
              "<th>" +
                "Tiempo E/S" +
              "</th>" +
              "<th>" +
                "Tiempo CPU" +
              "</th>" +
              "<th>" +
                "Tiempo E/S" +
              "</th>" +
              "<th>" +
                "Tiempo CPU" +
              "</th>" +
            "</tr>" +
          "</thead>" +
          "<tbody id='table_round_robin'>" +
            "<tr>" +
              "<td><input type='text' id='proceso" + this.numProcesos + "'></td>" +
              "<td><input type='text' id='tllegada" + this.numProcesos + "'></td>" +
              "<td><input type='text' id='tprocesador" + this.numProcesos + "'></td>" +
              "<td><input type='text' id='entrada" + this.numProcesos + "'></td>" +
              "<td><input type='text' id='tprocesador" + this.numProcesos + "_1'></td>" +
              "<td><input type='text' id='entrada" + this.numProcesos + "_1'></td>" +
              "<td><input type='text' id='tprocesador" + this.numProcesos + "_2'></td>" +
            "</tr>" +
          "</tbody>" +
        "</table>" +
        "<div class='ejecutar'>" +
          "<button type='button' name='button' id='agregarEntradas' class='btn waves-effect waves-light'>Agregar Proceso</button>" +
          "<button type='button' name='button' id='ejecutarFifo' class='btn waves-effect waves-light'>Ejecutar Algoritmo</button>" +
        "</div>"
      },

      filaEntrada: function (object) {
        var template;
        if (object.ejecucionEntrada === 0){
          template = "<tr>" +
              "<td>" + object.proceso + "</td>" +
              "<td>" + (object.terminarEjecucion[(object.terminarEjecucion.length - 1)] + (object.entrada * 100)) + "</td>" +
            "</tr>"
        }else {
          template = "<tr>" +
              "<td>" + object.proceso + "</td>" +
              "<td>" + (object.terminarEjecucion[(object.terminarEjecucion.length - 1)] + (object.entrada1 * 100)) + "</td>" +
            "</tr>"
        }
        return template
      }
    }
  }) ()

  algoritmo.Init()
}) (window, document, undefined)
7
