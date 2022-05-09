(function($) {
    $(function() {
        $.fn.counterField = function(opts){
            opts = opts || {};

            $(this).each(function(){
                const _that = this;

                if (_that.inited) {
                    return false;
                }

                const $field = $(this), startValue = 1, 
                    $input = $field.find('._input'),
                    $addBtn = $field.find('._plus'),
                    $removeBtn = $field.find('._minus');

                init();
                
                function init() {
                    _that._settings = {
                        min: parseInt( $input.data('min') ) || 1,
                        max: parseInt( $input.data('max') ),
                        lastValue: parseInt( $input.data('min') ) || 1,
                        disabled: $input.prop("disabled")
                    }
                    $input.val( _that._settings.min );
                    $removeBtn.addClass('_disabled');

                    if ( _that._settings.disabled ) {
                        switchDisabled(null, true);
                    }

                    $field.on('reset', reset).on('refresh', refresh)
                    .on('switchDisabled', switchDisabled )
                    .on('setValue', function(e, value){
                        setValue(value);
                    })
                    .on('switchError', function(e, bError){
                        bError = bError || false;

                        if ( bError ) {
                            $field.addClass('counter-field--error');
                        } else {
                            $field.removeClass('counter-field--error');
                        }
                    });

                    $input.on('focus', function(){
                        $field.addClass('counter-field--focus');
                    })
                    .on('focus-out blur', function(){
                        $field.removeClass('counter-field--focus');
                    })
                    .on('change', function(){
                        setValue( $(this).val(), false );

                        _that._settings.lastValue = $(this).val();
                    });

                    $addBtn.on('click', function(e){
                        if ( $(this).hasClass("_disabled") ) {
                            return false;
                        }

                        let prev = _that._settings.lastValue;
                        setValue( ++prev );

                        e.preventDefault();
                    })

                    $removeBtn.on('click', function(e){
                        if ( $(this).hasClass("_disabled") ) {
                            return false;
                        }

                        let prev = _that._settings.lastValue;
                        setValue( --prev );

                        e.preventDefault();
                    })
                    

                    _that.inited = true;
                }   

                function switchDisabled( e, bDisabled ){
                    bDisabled = bDisabled || false;

                    if ( bDisabled ) {
                        $field.addClass('counter-field--disabled');
                        $input.prop('disabled', true);
                    } else {
                        $field.removeClass('counter-field--disabled');
                        $input.prop('disabled', false);
                    }

                    _that._settings.disabled = bDisabled;
                }

                function setValue( value, bRunTrigger ) {
                    if ( _that._settings.disabled ) {
                        return false;
                    }

                    bRunTrigger = ( bRunTrigger !== false );
                    let parsedValue = parseInt(value);
                    if ( !parsedValue || parsedValue < _that._settings.min 
                        || ( _that._settings.max && parsedValue > _that._settings.max ) 
                    ) {
                        parsedValue = _that._settings.lastValue || _that._settings.min;
                    }

                    $input.val( parsedValue );

                    if ( parsedValue >= _that._settings.max ) {
                        $addBtn.addClass('_disabled');
                    } else {
                        $addBtn.removeClass('_disabled');
                    }

                    if ( parsedValue <= _that._settings.min ) {
                        $removeBtn.addClass('_disabled');
                    } else {
                        $removeBtn.removeClass('_disabled');
                    }
                    
                    if ( bRunTrigger ) {
                        $input.trigger('change');
                    }
                }

                function reset() {
                    _that._settings = {
                        min: parseInt( $input.data('min') ) || 1,
                        max: parseInt( $input.data('max') ),
                        lastValue: parseInt( $input.data('min') ) || 1,
                        disabled: $input.prop("disabled")
                    }
                    setValue( _that._settings.min, false );
                }

                function refresh() {
                    _that._settings.min = parseInt( $input.data('min') ) || 1;
                    _that._settings.max = parseInt( $input.data('max') );
                    _that._settings.disabled = $input.prop("disabled");

                    if ( _that._settings.lastValue < _that._settings.min || _that._settings.lastValue > _that._settings.max ) {
                        setValue( _that._settings.min, false );
                        _that._settings.lastValue = _that._settings.min;
                    }
                }
            });
        };

        $.fn.tabs = function () {
            $(this).each(function () {
                const $container = $(this);
                var _this = this;

                if ( _this.inited ) {
                    return false;
                }

                $container.find('.tabs__item').on('click', function(){
                    let $currentActiveTab = $container.find('.tabs__item._active');

                    if ( $currentActiveTab.data('tab') === $(this).data('tab') ) {
                        return false;
                    }

                    $currentActiveTab.removeClass('_active');
                    $container.find('.tabs__block').fadeOut(100);

                    $(this).addClass('_active');
                    $container.find('.tabs__block.' + $(this).data('tab')).fadeIn(300);
                });

                let $initActiveTab = $container.find('.tabs__item._active');
                if ( $initActiveTab.length ) {
                    $container.find('.tabs__block.' + $initActiveTab.data('tab')).show();
                } else {
                    $container.find('.tabs__item').eq(0).trigger('click');
                }

                _this.inited = true;
            });
        }

        $.fn.modernModal = function () {
            $(this).each(function () {
                var $popup = $(this);
                var _this = this;

                _this.c_options = {};

                var $mainContainer = $('body'),
                    $lockPadding = $("._lock-padding"),
                    lockPaddingValue = (window.innerWidth - $mainContainer.get(0).offsetWidth) + 'px',
                    delayAnimation = 500;

                $popup.data('self', $popup);
                $popup.find(".modal__close, ._close-modal").on('click', function (e) {
                    $popup.trigger('close');

                    e.preventDefault();
                });

                $popup.on('click', function (e) {
                    if (!$(e.target).closest('.modal__container').length) {
                        $(e.target).closest('.modal').trigger('close');
                    }
                });

                $popup.on('open', function (e, opts) {
                    var $popup = $(this);

                    opts = opts || {};
                    opts = (Object.keys(opts).length ? $.extend(false, {}, _this.c_options, opts) : _this.c_options);

                    if (window.bUnlock) {
                        var $activeModal = $('.modal._active.open');
                        var parentSelector = "";

                        if ($activeModal.length) {
                            if ($popup.attr('data-single') == 1) {
                                $activeModal.removeClass('_active open');
                            } else {
                                parentSelector = $activeModal.data('self');
                                $activeModal.removeClass('_active');
                            }
                        } else {
                            bodyLock();
                        }

                        if (opts.onBeforeOpen) opts.onBeforeOpen($popup, opts);

                        $popup.data('parent', parentSelector).addClass('open _active');

                        if (opts.onOpen) opts.onOpen($popup, opts);
                    }
                });

                $popup.on('setHandlers', function (e, opts) {
                    if (opts && Object.keys(opts).length > 0) {
                        let addedOpts = Object.keys(opts);
                        for (let i in addedOpts) {
                            let key = addedOpts[i];
                            if (!_this.c_options[key]) {
                                _this.c_options[key] = opts[key];
                            }
                        }
                    }
                });

                $popup.on('close', function (e, opts) {
                    opts = opts || {};
                    opts = (Object.keys(opts).length ? $.extend(false, {}, _this.c_options, opts) : _this.c_options);

                    if (window.bUnlock) {
                        var $activeParent = $popup.data('parent');

                        $popup.removeClass('open _active');
                        if ($activeParent.length > 0 && $activeParent.hasClass('open')) {
                            $activeParent.addClass('_active');
                            $popup.removeData('parent');
                        } else {
                            bodyUnlock();
                        }

                        if (opts.onCloseAfterSuccessFormSend) opts.onCloseAfterSuccessFormSend($popup);
                        if (opts.onClose) opts.onClose($popup, opts);
                    }
                });

                function bodyLock() {
                    if ($lockPadding.length > 0) {
                        $lockPadding.each(function (i, el) {
                            $(el).css({ 'padding-right': lockPaddingValue });
                        });
                    }

                    $mainContainer.css({ 'padding-right': lockPaddingValue });
                    $('body').addClass('_lock');

                    window.bUnlock = false;
                    setTimeout(function () {
                        window.bUnlock = true;
                    }, delayAnimation);
                };

                function bodyUnlock() {
                    setTimeout(function () {
                        if ($lockPadding.length > 0) {
                            $lockPadding.each(function (i, el) {
                                $(el).css({ 'padding-right': '0px' });
                            });
                        }

                        $mainContainer.css({ 'padding-right': '0px' });
                        $('body').removeClass('_lock');
                    }, delayAnimation);

                    window.bUnlock = false;
                    setTimeout(function () {
                        window.bUnlock = true;
                    }, delayAnimation);
                };
            });
        };
    });
})(jQuery);

$(document).ready(function(){
    /// init plugins
    $('._tabs').tabs();
    $('._counter').counterField();
    // $('._counter').trigger('switchDisabled', true);
    // $('._counter').trigger('switchError', true);
    $('.inputRadio, .inputCheckbox, .inputSelect').styler({
        selectSearch: true
    });
    $('body').on('change', '._inputFile', function(){
        let file = this.files[0], sBtnText = '',
            oParentBlock = $(this).closest('.field');
            
        if ( typeof file !== "undefined" ) {
            let name = file.name,
                size = file.size,
                type = file.type,
                maxSize = 26214400;

            sBtnText = name + ' [' + ( (size / 1024).toFixed( 0 ) > 1000 ? (size / 1024 / 1024).toFixed( 2 ) + 'Мб]' : (size / 1024).toFixed( 2 ) + 'Кб]' );
            if ( size >= maxSize ) {
                oParentBlock.addClass('field--error');
                oParentBlock.find( 'input[type="file"]' ).val('');
                if ( !oParentBlock.find( '.field__error-message' ).length ) {
                    oParentBlock.append( '<p class="field__error-message"></p>' );
                }
                oParentBlock.find( '.field__error-message' ).html('Превышен масимальный размер файла (25Мб)');
            } else {
                oParentBlock.removeClass('field--error').find( '.field__error-message' ).remove();
            }
            
            oParentBlock.find( '._text' ).removeClass('__icon-blank').text( sBtnText );
        } else {
            oParentBlock.find( '._text' ).addClass('__icon-blank').text( 'Прикрепите файл' );
            oParentBlock.find( '.field__error-message' ).remove();
            
            if ( !$(this).prop('required') ) {
                oParentBlock.removeClass('field--error');
            } else {
                oParentBlock.addClass('field--error');
            }
        }
    });
    window.bUnlock = true;
    $('._modern-modal').modernModal();
    $("body").on('click', "._show-modal", function(e){
        var $popup = $( $(this).attr('data-content') );

        if ( !$popup.length ) {
            console.error('Modal "'+$(this).attr('data-modal')+'" not found!');
            return false;
        }

        $popup.trigger('open');

        e.preventDefault();
    });
    /// init plugins

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
    })
    .on('click', '._characteristic-choose', function(){
        let bSelected = $(this).hasClass('_selected');

        $(this).find('input').prop('checked', !bSelected).trigger('change');
    })
    .on('change', '._characteristic-choose input.inputCheckbox', function(){
        let $input = $(this), $product = $input.closest('._characteristic-choose');

        let bSelected = $input.prop('checked');
        if ( bSelected ) {
            $product.addClass('_selected');
        } else {
            $product.removeClass('_selected');
        }
    });
});