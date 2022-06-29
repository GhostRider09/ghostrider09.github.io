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
                    _that._options = opts;
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

                    if ( _that._options.onSetValue ) {
                        _that._options.onSetValue.call(_that, parsedValue);
                    }

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

        $.fn.orderTable = function (opts) {
            opts = opts || {};

            $(this).each(function () {
                const $currentTable = $(this);
                let _this = this;

                if ( _this.inited ) {
                    return false;
                }

                _this._warmex = {
                    type: ( $currentTable.data('type') || "PRODUCTS" ),
                    options: opts 
                };

                $currentTable.on('appendPosition', function( e, item ){
                    if ( !item || !item.id ) {
                        console.error('[Warmex] Передан некорректный продукт!');
                        return false;
                    }

                    let nextId = getNextRowId();
                    let $newProductItem = $(`<div class="table__tr _order-item" data-item-id="${nextId}"></div>`);

                    item.rowId = nextId;
                    appendProduct($newProductItem, item);
                    appendFeatures($newProductItem, nextId, item.features);
                    appendCounter($newProductItem, nextId);
                    appendPrice($newProductItem, nextId, item.price);
                    $newProductItem.append(`<div class="table__td table__td--mob-footer __txt-right" data-title="Сумма">
                        <span class="__nowrap __rub _sum-label">${WMX.number_format( item.price, 2, '.', "&nbsp;" )}</span>
                    </div>`);
                    appendClose( $newProductItem );

                    $currentTable.append( $newProductItem );
                    $currentTable.children().eq(-1).find('._counter').counterField({
                        onSetValue: function(value) {
                            let price = $(this).closest('._order-item').find('input._price').val(),
                                $prodSumLabel = $(this).closest('._order-item').find('._sum-label');

                            $prodSumLabel.html( WMX.number_format( roundAsCurrency( price * value ), 2, ".", "&nbsp;" ) );
                            
                            updateSummarize();
                        }
                    });

                    updateSummarize();
                });

                $currentTable.on('removePosition', function( e, productRow ){
                    if ( productRow && !$(productRow).length ) {
                        console.error('[Warmex] Передан некорректный объект!');
                        return false;
                    }

                    $(productRow).remove();

                    updateSummarize();
                });

                _this.inited = true;

                function updateSummarize() {
                    let $summarize = $(_this._warmex.options.summarize);

                    if ( !$summarize.length ) {
                        console.error('[Warmex] Не удалось найти объект суммы Итого!');
                        return false;
                    }

                    let $tables = _this._warmex.options.form.find( '.'+_this._warmex.options.tablesClass );
                    let $rows = $tables.find('._order-item');
                    let itogo = 0;
                    $rows.each(function(i, row){
                        let $product = $(row);
                        itogo += roundAsCurrency($product.find('input._price').val() * $product.find('input._count').val());
                    });

                    $summarize.html( WMX.number_format( itogo, 2, '.', "&nbsp;" ) );
                }

                function appendProduct( $newItem, oProduct ) {
                    let noProductImagePath = '/local/templates/warmex/img/no-product.svg';

                    let srcImage = oProduct.image || noProductImagePath;
                    let productCell = `<div class="table__td table__td--product table__td--link">
                        <a href="#" class="table__link table__link--show-modal product-link _show-modal" data-content="._products-modal">
                            <div class="product-link__container">
                                <div class="product-link__image">
                                    <img src="${srcImage}" alt="${oProduct.name}">
                                </div>
                                <div class="product-link__title">${oProduct.name}</div>
                            </div>
                            <input type="hidden" class="_product" name="${getFieldNamePrefix(oProduct.rowId)}[NOMENCLATURE]" value="${oProduct.id}">
                        </a>                        
                    </div>`;

                    $newItem.append( productCell );
                }

                function appendFeatures( $newItem, rowId, features ) {
                    let cell = `<div class="table__td table__td--link table__td--features" data-title="Характеристики" >
                            <a href="#" class="table__link table__link--show-modal choose-feature__item" data-content="._features-modal">Выбрать характеристики</a>
                            <input type="hidden" class="_features" name="${getFieldNamePrefix(rowId)}[FEATURE]" value="">
                        </div>`;

                    if(!features) {
                        cell = `<div class="table__td table__td--link table__td--features" data-title="Характеристики" >
                            <input type="hidden" class="_features" name="${getFieldNamePrefix(rowId)}[FEATURE]" value="">
                        </div>`;
                    }

                    $newItem.append( cell );
                }

                function appendCounter( $newItem, rowId ) {
                    let cell = `<div class="table__td table__td--counter __txt-right">
                        <div class="field table-field-counter counter-field _counter">
                            <span class="counter-field__minus _minus"><i class="icons __icon-subtract-line"></i></span>
                            <input type="text" class="counter-field__input _input _count" name="${getFieldNamePrefix(rowId)}[COUNT]" autocomplete="off" />
                            <span class="counter-field__plus _plus"><i class="icons __icon-plus-only"></i></span>
                        </div>
                    </div>`;

                    $newItem.append( cell );
                }

                function appendPrice( $newItem, rowId, price ) {
                    let cell = `<div class="table__td table__td--mob-footer table__td--first-footer-row table__td--price __txt-right" data-title="Цена">
                        <span class="__nowrap __rub _price-label">${WMX.number_format( price, 2, '.', "&nbsp;" )}</span>
                        <input type="hidden" class="_price" name="${getFieldNamePrefix(rowId)}[PRICE]" value="${price}">
                    </div>`;

                    $newItem.append( cell );
                }

                function appendClose( $newItem ) {
                    $newItem.append('<div class="table__td table__td--close-icon __txt-right"><span class="_remove-product"><i class="icons __icon-close-only"></i></span></div>');
                    $newItem.find('._remove-product').on('click', function(){
                        $currentTable.trigger('removePosition', $(this).closest('._order-item'));
                    });
                }

                function getNextRowId() {
                    let $lastProduct = $currentTable.find('._order-item').eq(-1);
                    if ( $lastProduct.length && typeof $lastProduct.data('itemId') !== "undefined" ) {
                        return parseInt($lastProduct.data('itemId')) + 1;
                    }

                    return 0
                }

                function getFieldNamePrefix( rowId ) {
                    return `FIELDS[${_this._warmex.type}][${rowId}]`;
                }

                function roundAsCurrency(number) {
                    return Math.round(number * 100) / 100;
                }
            });
        }
    });
})(jQuery);

WMX = {
    dig3cut: function(num) { 
        e = num.toString();
        let t = "";
        
        for (n = e.length - 3; n > 0; n -= 3)
            t = "&nbsp;" + e.substr(n, 3) + t;

        return e.substr(0, 3 + n) + t 
    },
    number_format: function(number, decimals, dec_point, thousands_sep) {
        number = (number + '')
            .replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? '&nbsp;' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? ',' : dec_point,
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                        .toFixed(prec);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        var s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '')
                .length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1)
                .join('0');
        }
        return s.join(dec);
    }
}

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
    })
    .on('input', '._filter-modal-elements input', function(){
        let $input = $(this), $icon = $input.parent().find('._filter-icon');

        let $container = $input.closest('._modern-modal').find( $input.data('container') );
        if ( !$container.length ) {
            console.error('[WMX] Elements container not found!');
            return false;
        }
        
        if ( $input.val().length < 2 ) {
            if ( $container.hasClass('_filtered') ) {
                resetSearch();
            }

            return false;
        }       
        

        let inputValue = $input.val().toLowerCase();

        $icon.addClass('__icon-close-only').removeClass('__icon-search');
        $container.find('._filter-item').each((i, el) => {
            let $item = $(el), $valueEl = $item.find('._filter-value');

            if ( !~($valueEl.html().toLowerCase().indexOf( inputValue )) ) {
                $item.hide();
            } else {
                $item.show();
            }
        });
        $container.addClass('_filtered');

        if ( !$icon.hasClass('_inited') ) {
            $input.on('wmx.clear', () => { resetSearch(); });
            $icon.on('click', () => { resetSearch(); });
            $icon.addClass('_inited');
        }

        function resetSearch() {
            if ( $input.val().length ) {
                $input.val('');
                $icon.removeClass('__icon-close-only').addClass('__icon-search');
                $container.find('._filter-item').show();
                $container.removeClass('_filtered');
            }
        }
    });




    // TODO: вспомогательные скрипты. Удалить при внедрении
    $('._load-more').on('click', function(){
        $(this).addClass('__loading').prop('disabled', true);
    })
    $('._load-more-v2').on('click', function(){
        if ( !$('.history__table').find('.preloader').length ) {
            $('.history__table').append('<div class="preloader"><span></span></div>');
            $(this).prop('disabled', true);
        }
    })
    const $orderForm = $('._order-form');
    if ( $orderForm.length ) {
        $orderForm.find('._order-table').orderTable({
            tablesClass: '_order-table',
            form: $orderForm,
            summarize: $orderForm.find('._order-summarize')
        });
        
        $('._add-product').click(function(){
            // добавление записи в таблицу
            $(this).closest('.section-table').find('._order-table').trigger('appendPosition', {
                id: 12,
                name: 'Дверное полотно ZARGO Duo 600 скандинавский дуб с/о (армированное)',
                image: '/img/trash/order/product-01.jpg',
                price: 12123
            });
        });
    }
});