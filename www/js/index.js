/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var cargarDB ={
    db:"",
    initialize: function(){
        //generamos el conector
        this.db = window.openDatabase("localDB","1.0","Base de datos de prueba",2*1024*1024);
        this.cargaDB();
    },
    cargaDB: function(){
        console.log("Cargar la base de datos;"); 
        //transaccion
        this.db.transaction(this.mostrarDB,this.mostrarDBerror);        
    },
    mostrarDB: function(tx){
        var sql = "select * from usuarios ORDER BY ultimos DESC";
        console.log("Lanzamos la consulta");
        tx.executeSql(sql,[],
            //Función del resultado OK
            function(tx,result){
                console.log("Se ha producido la consulta con exito");
                if(result.rows.length>0){
                    for(var i = 0;i<result.rows.length;i++){
                        var fila = result.rows.item(i);
                        console.log("ROW "+i+" nombre: "+fila.nombre);
                        $("#listaContactos ul").append("<li><a data-id='"+fila.id+"' href='datos.html' data-ajax='false'><img src='./img/iconUser.png' class='imagenLista'><div class='nombreLista' id='nombreUsuario'>"+fila.nombre+"</br>"+fila.apellidos+"</br>"+fila.cargo+"</div></a></li>").listview('refresh');
                       //Capturamos el elemento cogiendo el id
                        $("#listaContactos a").click(function(e){
                            e.preventDefault();
                            var id = $(this).attr("data-id");
                            window.localStorage.setItem("id", id);
                            var href = $(this).attr("href");
                            document.location.href = href;
                        });
                    }
                }
            },
            function(tx,error){
                this.mostrarDBerror;
            }
            );

            
    },
    mostrarDBerror: function(err){
        console.log("Se ha producido un error en la creacion de la base de datos: "+error.code);
    }

};

var confDB = {
    existe_db:null,
    db:"",
    initialize: function(){
        //variable existe db
        existe_db = window.localStorage.getItem("existe_db");
        //creamos el enlace con la base de datos
        this.db = window.openDatabase("localDB","1.0","Base de datos de prueba",2*1024*1024);
        //preguntamos si es necesario crear la base de datos
        if(existe_db==null){
            console.log("Creamos la base de datos");
            this.createDB();
        }else{
            console.log("Cargamos la base de datoos");
            cargarDB.initialize();
        }
    },

    createDB: function(){
        console.log("No existe la base de datos");
        //window.localStorage.setItem("existe_db",1);

        this.db.transaction(this.createLocalDB,this.createDBError,this.createDBSucc);        
    },
    createLocalDB: function(tx){
        var sql="create table if not exists usuarios ("+
            "id integer primary key autoincrement,"+
            "nombre varchar(50),"+
            "apellidos varchar(256),"+
            "cargo varchar(128),"+
            "email varchar(64),"+
            "ultimos integer(1) )";
        
        tx.executeSql(sql);

        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'Carles','Choví Estarelles','Alumno','46chovi9@gmail.com',0)";
        tx.executeSql(sql);

        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'David','Alòs Bosch','Alumno','ab95david@gmail.com',0)";
        tx.executeSql(sql);

        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'Julian','Molina','Alumno','wodyjuli@gmail.com',1)";
        tx.executeSql(sql);

        sql = "insert into usuarios(id,nombre,apellidos,cargo,email,ultimos)"+
        "values(null,'Iván','Estruch','Alumno','estruch@gmail.com',1)";
        tx.executeSql(sql);
    },
    createDBError: function(err){
        console.log("Se ha producido un error en la creacion de la base de datos: "+error.code);
    },
    createDBSucc: function(){
        console.log("Se ha generado la base de datos con exito");
        window.localStorage.setItem("existe_db",1);
    }
};
 
var app = {
    // Application Constructor
    initialize: function() {
        //Lanza el evento de phonegap(bundEvents)
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //Esperaremos hasta que el dispositivo este listo y lanzaremos otro método(onDeviceReady)
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        //Lanzamos la configuración de la base de datos
        confDB.initialize();
    }
};

app.initialize();