function CambiaTipoCliente(tipoCliente) {


    if (tipoCliente == 'persona') {

        $("#fcc4trApellidoCC").show();
        $('#fcc4txtCodGiroCC').val('960909');
        $('#fcc4dropGiroCC').val('960909');
        $("#fcc4labelNombreCC").text("Nombres");
        $("#fcc4labelCreaCliente").text("Datos del Cliente");

        $("#fcc4trNombreCC").show();
        $("#fcc4trApellidoCC").show();
        $("#fcc4trdropGiro").show();
        $("#fcc4trdropSegmentoCC").show();
        $("#fcc4trTituloDatosFacturacion").show();
        $("#fcc4trCalleCC").show();
        $("#fcc4trNumeroCC").show();
        $("#fcc4trdropComunaCC").show();

    } else if (tipoCliente == 'personaboleta') {

        $("#fcc4trApellidoCC").show();
        $('#fcc4txtCodGiroCC').val('960909');
        $('#fcc4dropGiroCC').val('960909');
        $("#fcc4labelNombreCC").text("Nombres");
        $("#fcc4labelCreaCliente").text("Datos del Cliente");

        $("#fcc4trNombreCC").hide();
        $("#fcc4trApellidoCC").hide();
        $("#fcc4trdropGiro").hide();
        $("#fcc4trdropSegmentoCC").hide();
        $("#fcc4trTituloDatosFacturacion").hide();
        $("#fcc4trCalleCC").hide();
        $("#fcc4trNumeroCC").hide();
        $("#fcc4trdropComunaCC").hide();

    } else {

        $("#fcc4trApellidoCC").hide();
        $("#fcc4labelNombreCC").text("Razón Social");
        $("#fcc4labelCreaCliente").text("Datos de la Empresa");

        $("#fcc4trNombreCC").show();
        $("#fcc4trdropGiro").show();
        $("#fcc4trdropSegmentoCC").show();
        $("#fcc4trTituloDatosFacturacion").show();
        $("#fcc4trCalleCC").show();
        $("#fcc4trNumeroCC").show();
        $("#fcc4trdropComunaCC").show();

    }

}