// import XLSX from 'js/component/xlsx/xlsx.js';
// import saveAs from 'js/component/file-saver/src/FileSaver.js';
Vue.component('generar-ficha', {
    data: function () {
      return {
        count: 0,
        placeholder: 'Seleccionar tiempo',
            texto: '',
            codigo: [],
            script:[],
            ficha:{
                cantidad:10,
                tiempo:0,
                radio:'user'
            },
            horario:[
                {id:0,msj:'Sin limite',tiempo:'00:00:00'},
                {id:1,msj:'15 minutos',tiempo:'00:15:00'},
                {id:2,msj:'35 minutos',tiempo:'00:35:00'},
                {id:3,msj:'1 Hora',tiempo:'01:00:00'},
                {id:4,msj:'3 Horas',tiempo:'03:00:00'},
                {id:5,msj:'5 Horas',tiempo:'05:00:00'},
                {id:6,msj:'10 Horas',tiempo:'10:00:00'}
            ]
      }
    },
    methods:{
        // import XLSX from 'js/component/xlsx/xlsx.js';
// import saveAs from 'js/component/file-saver/src/FileSaver.js';
        generarFicha:function(){//GENERAR CODIGOS DE FICHAS
            let cantidad = this.ficha.cantidad; //Cantidad a generar
            let consonantes = 'bcdfghjklmnpqrstwxyz'
            let vocales = 'aeiou'
            let fichas = [];
            for(var i=0; i< cantidad; i++){
                let cadenas = []
                for(var e=0; e< 3;e++){
                    let cadena1 = consonantes.charAt(Math.floor(Math.random()*consonantes.length));
                    let cadena2 = vocales.charAt(Math.floor(Math.random()*vocales.length));
                    cadenas.push(cadena1+cadena2);
                }
                    let numero = Math.floor((Math.random() * (99 - 10 + 1)) + 10);
                    cadenas.push(numero);
                    let union = cadenas.join('')
                    fichas.push(union);
            }
            this.codigo = fichas;
            this.generarComando();
    
        },
        generarComando:function(){
            this.script = [];
            let cantidad = this.ficha.cantidad;
            let tiempo = this.ficha.tiempo;
            for(const cod in this.codigo){
                let comando = 'add name='+this.codigo[cod]+' limit-uptime='+tiempo+' disabled=no';
                this.script.push(comando);

            }
            var text = document.getElementById("textarea");
            text.value = '/ip hotspot user \n'+ this.script.join("\n");
        },

        copiarTexto:function(){
            // textoCopiado = this.texto;
            let textoCopiado = document.getElementById("textarea");
            console.log(textoCopiado);
            textoCopiado.select();
            document.execCommand("copy");

            if(textoCopiado.value == ''){
                this.success('No hay ningun scrip!','is-danger');
            }else{
                this.success('Script copiado con exito','is-success');
            }
        },
        success(mensaje,tipo) {
                this.$buefy.notification.open({
                    message: mensaje,
                    type: tipo
                });
        },
        arrayBi:function() {//ORDENAR codigos en Array de Arrays 
            let ficha = this.codigo;
            let horas = this.ficha.tiempo;
            let datoExcel = [];

            for (let i = 0; i < ficha.length; i++) {
                datoExcel[i] = new Array(1)
                datoExcel[i][0] = ficha[i];
                datoExcel[i][1] = horas;
                //datoExcel[i][0] = '['+ficha[i]+','+"prueba"+']';
                
            }
            return datoExcel;
        },
        crearExcel:function(){ //CONTRUIR ARCHIVO EXCEL
            // import * as XLSX  from 'component/xlsx/xlsx.js';
            // import * as saveAs  from 'component/file-saver/src/FileSaver.js';

            let arrayCodigo = this.arrayBi();
            var wb = XLSX.utils.book_new();

            wb.Props = {
                Title: "Fichas",
                Subject: "Test",
                Author: "Martin Crespo",
                Company: "Netline Selva",
                CreatedDate: new Date(2021,11,12)
            };
            wb.SheetNames.push("Codigos","Codigos2"); //crear nueva hoja
            var ws_data = arrayCodigo; /*[['Prueba' , 'fichas', '1']]; */
            console.log(ws_data)
            //var ws = XLSX.utils.aoa_to_sheet([ws_data,["1","2","3"]]); //Colocar [] porque pide un array de array
            var ws = XLSX.utils.aoa_to_sheet(ws_data); //Colocar [] porque pide un array de array
            wb.Sheets["Codigos"] = ws; //añador informacion a la hoja creada

            var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
            function s2ab(s) {
  
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
                
            }

            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'fichas.xlsx');
        },
        
    },
    
    template: `
    <div class="container">
    <div class="info">
        <h1 class="title">Generador de Usuarios</h1>
    </div>
    <div class="columns">
        <div class="column is-6">
            <b-field horizontal label="Cantidad" message="Ingrese la cantidad de fichas">
                <b-numberinput v-model="ficha.cantidad" controls-alignment="right" controls-position="compact" min="10" max="1000" step="10"></b-numberinput>
            </b-field>

            <b-field horizontal label="Tiempo">
                <b-select v-model="ficha.tiempo">
                    <option v-for="hora in horario" :key="hora.id" :value="hora.tiempo">{{hora.msj}}</option>
                </b-select>
            </b-field>

            <b-field horizontal label="Tipo de ficha">
                 <div class="field">
                    <b-radio v-model="ficha.radio"
                        native-value="user"
                        type="is-info">
                        Solo usuario
                    </b-radio>
                </div>
                <div class="field">
                    <b-radio v-model="ficha.radio"
                        native-value="contra"
                        type="is-info">
                        Usuario y Contraseña
                    </b-radio>
                </div>
            </b-field>

            <b-field horizontal label="Orden de ficha">
                <ul>
                    <li>C = Consonante</li>
                    <li>V = Vocal</li>
                    <li>N = Numero</li>
                </ul>
            </b-field>

            <b-button id="generar" type="is-primary" v-on:click="generarFicha()">Generar fichas</b-button>
        </div>

        <div class="column is-6">
            <b-field label="Codigo">
                <b-input v-model="texto" id="textarea" type="textarea" readonly></b-input>
            </b-field>

        <b-button type="is-info" v-on:click="copiarTexto()">Copiar codigo</b-button>
        <b-button icon-left="far fa-file-excel" type="is-success" v-on:click="crearExcel()">Bajar XLSX</b-button>
        <!-- <button v-on:click="arrayBi()">Create Excel</button> -->
        </div>
    </div>
</div>`
  })