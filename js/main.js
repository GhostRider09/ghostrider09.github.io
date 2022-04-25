$(document).ready(function(){
    $('body').on('click', '._switch-pass', function(e){
        const $field = $(this).closest('.field').find('.field__element');

        let bShowed = $(this).hasClass('__icon-eye-show');

        if ( bShowed ) {
            $(this).removeClass('__icon-eye-show').addClass('__icon-eye-hide');
            $field.prop('type', 'password');
        } else {
            $(this).addClass('__icon-eye-show').removeClass('__icon-eye-hide');
            $field.prop('type', 'text');
        }
        
        e.preventDefault();
    })
    .on('click', '._show-main-menu', function(e){
        $('._main-menu-area').addClass('__opened');
        $('body').addClass('_open-window');

        e.preventDefault;
    })
    .on('click', '._close', function(e){
        $( $(this).data('target') ).removeClass('__opened');
        $('body').removeClass('_open-window');

        e.preventDefault;
    });
});