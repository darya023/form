$(document).ready(function(){
    $('body').on('keyup blur', '.js_input', function(){
        let name = $(this).attr('name'),
        val = $(this).val(),
        field = $(this),
        form = field.closest('.form'),
        inputs = form.find('.js_input'),
        warning = form.find('.js_warning');
        messages = form.find('.js_message');

        field.removeClass('invalid');
        validationFields(name,val,field);

        if (warning.text() != '') {
            warning.text('');
        }
    });

    $('body').on('click', '.js_submit', function(e){
        e.preventDefault();

        let form = $(this).closest('.form'),
            fields = form.find('.js_input'),
            url = form.attr('action'),
            form_data = form.serialize(),
            warning = form.find('.js_warning'),
            messages = form.find('.js_message'),
            invalidFields = 0;

        for (let i = 0; i < fields.length; i++) {
            let field = $(fields[i]),
                name = field.attr('name'),
                val = field.val();

            validationFields(name,val,field);

            if (field.hasClass('invalid')) {
                invalidFields++;
            }
        }

        if (invalidFields == 0) {
            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                data: form_data,
                success: function (response) {
                    console.log(response);
                },
                error: function (response) {
                    console.log(response);
                }
            });
            warning.text('Форма была отправлена');
        } else {
            if (messages.text() != '') {
                messages.text('');
            }
            warning.text('Поля заполнены некорректно');
        }
    })
});

function validationFields(name,val,field) {
    let template, message;
    switch(name){
        case 'name':
            template = /^([а-яА-Я]+(\s|\-)*)+$/;
            message = "Для ввода используйте русские буквы, пробелы, “-”";
            changeClass(val,template,field,message);
        break;

        case 'phone':
            template = /^([0-9]+(\s|\-|\+)*)+$/;
            message = "Для ввода используйте цифры, “-”, пробелы, “+”";
            changeClass(val,template,field,message);
        break;

        case 'email':
            template = /^[0-9A-Za-z!#$%&'*+\/=?^_`{|}~\.\-]+@[0-9A-Za-z!#$%&'*+\/=?^_`{|}~\-]+(\.[0-9A-Za-z!#$%&'*+\/=?^_`{|}~\-]+)+$/;
            message = "Введите строку формата email@email.com";
            changeClass(val,template,field,message);
            //так как не обязательное поле
            if(val == '') {
                field.removeClass('invalid').removeClass('valid');
                field.next('.js_message').text('');
            }
        break;
    }
}

function changeClass(val, template,field,message) {
    if (template.test(val)) {
        field.removeClass('invalid').addClass('valid');
        field.next('.js_message').text('');
    } else {
        field.removeClass('valid').addClass('invalid');
        field.next('.js_message').text(message);
    }
}
