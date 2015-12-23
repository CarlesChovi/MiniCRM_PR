var cargarDetalles = {
    db: "",

    initialize: function(){
        //GENERAMOS LA BBDD
        this.db = window.openDatabase("localDB", "1.0", "Base de datos de prueba", 2*1024*1024);
        this.cargarDB();
    },

    cargarDB: function(){
        console.log("CARGAMOS LA BBDD YA EXISTENTE");
        //Transacción
        this.db.transaction(this.cargarDetalles, this.mostrarDBError);
    },
    
    cargarDetalles: function(tx){
        //PASO 5 IMPLEMENTADO AQUÍ
        var id = window.localDB.getItem("id");
        var sql = "SELECT * FROM usuarios WHERE id = "+id+";";
        console.log("LANZAMOS LA CONSULTA SQL DE DETALLES");
        tx.executeSql(
            sql,
            [], 
            //Función de resultado OK
            function(tx, result){
                console.log("CONSULTA DE DETALLES REALIZADA CON EXITO, RECUPERANDO DATOS");
                if(result.rows.length>0){
                    for(var e=0; e<result.rows.length; e++){
                        var fila = result.rows.item(e);
                        //Aquí actualizaría mi html automáticamente para cargar datos de la BBDD
                        console.log("ITERAMOS DETALLES");
                        //RECUPERACIÓN DE DATOS
                        $("#listaDetalles ul").append(

                            "<li><img src="./img/iconUser.png" class='imagenLista'>"+
                                "<div class='nombreLista'>"+fila.nombre+"</div>"+
                                "<div class='profesionLista'>"+fila.profesion+"</div>"+
                            "</li>"+

                            "<li>"+
                                "<h2>Correo</h2>"+
                                "<div class='nombreLista'>"+fila.email+"<img src='./img/correo.png' class='imagenLista' align='right' padding-botton='90px;'/></div>"+
                            "</li>"+

                            "<li>"+
                                "<h2>Teléfono</h2>"+
                                "<div class='nombreLista'>"+fila.telefono+"<img src='./img/telefono.png' class='imagenLista' align='right'/></div>"+
                            "</li>").listview('refresh');
                    }
                }
            },
            //Función de error
            function(tx, error){
                this.mostrarDBError(error);
            }
        );
    },

    mostrarDBError: function(err){
        console.log("ERROR DE CARGA DE BBDD "+err.code);
        console.log("MENSAJE DE ERROR "+err.message);
    }

};