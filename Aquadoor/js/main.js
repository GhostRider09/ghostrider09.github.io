(function($) {
    $(function() {
        $.fn.counterField = function(opts){
            opts = opts || {};

            $(this).each(function(){
                const _that = this;

                if (_that.inited) {
                    return false;
                }

                const $field = $(this), startValue = opts.startValue || 1, 
                    $input = $field.find('._input'),
                    $addBtn = $field.find('._plus'),
                    $removeBtn = $field.find('._minus');

                init();
                
                function init() {
                    let minValue = ( typeof $input.data('min') !== "undefined" && !isNaN(parseInt( $input.data('min') )) ? parseInt( $input.data('min') ) : startValue );
                    _that._options = opts;
                    _that._settings = {
                        min: minValue,
                        max: parseInt( $input.data('max') ),
                        lastValue: parseInt( $input.val() ) || minValue,
                        disabled: $input.prop("disabled")
                    }
                    // $input.val( _that._settings.min );
                    setValue(  $input.val() || _that._settings.min );
                    // $removeBtn.addClass('_disabled');

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
                    if ( parsedValue !== 0 && ( !parsedValue || parsedValue < _that._settings.min 
                        || ( _that._settings.max && parsedValue > _that._settings.max ) 
                    )) {
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
                    let minValue = ( typeof $input.data('min') !== "undefined" && !isNaN(parseInt( $input.data('min') )) ? parseInt( $input.data('min') ) : startValue );
                    _that._settings = {
                        min: minValue,
                        max: parseInt( $input.data('max') ),
                        lastValue: minValue,
                        disabled: $input.prop("disabled")
                    }
                    setValue( _that._settings.min, false );
                }

                function refresh() {
                    let minValue = ( typeof $input.data('min') !== "undefined" && !isNaN(parseInt( $input.data('min') )) ? parseInt( $input.data('min') ) : startValue );
                    _that._settings.min = minValue;
                    _that._settings.max = parseInt( $input.data('max') );
                    _that._settings.disabled = $input.prop("disabled");

                    if ( _that._settings.lastValue < _that._settings.min || _that._settings.lastValue > _that._settings.max ) {
                        setValue( _that._settings.min, false );
                        _that._settings.lastValue = _that._settings.min;
                    }
                }
            });
        };

        $.fn.counterRange = function(opts){
            opts = opts || {};

            $(this).each(function(){
                const _that = this;

                if (_that.inited) {
                    return false;
                }

                const $field = $(this), $input = $field.find('._input'),
                    $addBtn = $field.find('._plus'),
                    $removeBtn = $field.find('._minus');

                init();
                
                function init() {
                    _that._options = opts;
                    _that._settings = {
                        min: parseInt( $input.data('min') ) || -99,
                        max: parseInt( $input.data('max') ) || 99,
                        step: parseInt( $input.data('step') ) || 5,
                        lastValue: parseInt( $input.val() ) || parseInt( $input.data('min') ) || 0,
                        disabled: $input.prop("disabled")
                    }
                    setValue(  $input.val() || 0 );

                    if ( _that._settings.disabled ) {
                        switchDisabled(null, true);
                    }

                    $input.inputmask({regex: "[-|+]*\\d{1,2}%", greedy: false});
                    $field.on('reset', reset)
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
                    });

                    $addBtn.on('click', function(e){
                        if ( $(this).hasClass("_disabled") ) {
                            return false;
                        }

                        let next = _that._settings.lastValue + _that._settings.step;
                        $input.val( next > _that._settings.max ? _that._settings.max : next ).trigger('change');

                        e.preventDefault();
                    })

                    $removeBtn.on('click', function(e){
                        if ( $(this).hasClass("_disabled") ) {
                            return false;
                        }

                        let next = _that._settings.lastValue - _that._settings.step
                        $input.val( next < _that._settings.min ? _that._settings.min : next ).trigger('change');

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

                    if ( parsedValue === undefined || typeof parsedValue === "undefined" || parsedValue < _that._settings.min 
                        || ( _that._settings.max && parsedValue > _that._settings.max ) 
                    ) {
                        parsedValue = _that._settings.lastValue || _that._settings.min;
                    }

                    $input.val( parsedValue > 0 ? "+" + parsedValue : parsedValue );
                    _that._settings.lastValue = parsedValue;

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
                        min: parseInt( $input.data('min') ) || -99,
                        max: parseInt( $input.data('max') ) || 99,
                        step: parseInt( $input.data('step') ) || 5,
                        lastValue: parseInt( $input.val() ) || parseInt( $input.data('min') ) || 0,
                        disabled: $input.prop("disabled")
                    }
                    setValue( parseInt( $input.val() ) || _that._settings.min, false );
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
                    counterpartySale: ( parseInt($currentTable.data('counterpartySale')) || 0 ),
                    noSale: ( $currentTable.data('noSale') === "Y" ),
                    options: opts 
                };

                $currentTable.on('appendPosition', function( e, item ){
                    if ( !item || !item.id ) {
                        console.error('[Warmex] Передан некорректный продукт!');
                        return false;
                    }

                    let calculateResult = WMX.calculateSales({
                        counterpartySale: ( _this._warmex.noSale ? 0 : _this._warmex.counterpartySale ),
                        propertySum: 0,
                        clientSale: 0,
                        price: item.price,
                        count: 1,
                    });

                    let nextId = getNextRowId();
                    let $newProductItem = $(`<div class="table__tr _order-item" data-item-id="${nextId}"></div>`);

                    item.rowId = nextId;
                    appendProduct($newProductItem, item, calculateResult);
                    if ( item.category !== "FITTINGS" ) {
                        appendFeatures($newProductItem, nextId, item.features);
                    }

                    if ( _this._warmex.options.isSimpleCalc ) {
                        appendCounter($newProductItem, nextId);
                        appendPrice($newProductItem, nextId, { price: calculateResult.counterpartyPrice, rrc: calculateResult.basePrice });
                        $newProductItem.append(`<div class="table__td table__td--mob-footer __txt-right" data-title="Ваша сумма">
                            <span class="__nowrap __rub _sum-counterparty-label" data-sum="${calculateResult.counterpartySum}">${WMX.formatAsCurrencyLabel( calculateResult.counterpartySum )}</span>
                        </div>`);
                    } else {
                        appendPrice($newProductItem, nextId, { price: calculateResult.counterpartyPrice, rrc: calculateResult.basePrice });
                        appendCounter($newProductItem, nextId);
                        $newProductItem.append(`<div class="table__td table__td--mob-footer __txt-right" data-title="Ваша сумма">
                            <span class="__nowrap __rub _sum-counterparty-label" data-sum="${calculateResult.counterpartySum}">${WMX.formatAsCurrencyLabel( calculateResult.counterpartySum )}</span>
                        </div>`);
                        $newProductItem.append(`<div class="table__td table__td--mob-footer  __gray-text __txt-right" data-title="Сумма клиенту">
                            <span class="__nowrap __rub _sum-client-label" data-sum="${calculateResult.clientSum}">${WMX.formatAsCurrencyLabel( calculateResult.clientSum )}</span>
                        </div>`);
                        appendRange($newProductItem, nextId);
                        $newProductItem.append(`<div class="table__td table__td--mob-footer  __gray-text __txt-right" data-title="Ваш доход">
                            <span class="__nowrap __rub _sum-income-label" data-sum="${calculateResult.counterpartyIncome}">${WMX.formatAsCurrencyLabel( calculateResult.counterpartyIncome )}</span>
                        </div>`);
                    }
                    appendClose( $newProductItem );

                    if ( !_this._warmex.options.isSimpleCalc ) {
                        if ( !$currentTable.find('._section-summarize').length ) {
                            appendSectionSummarize($currentTable);
                        }

                        $currentTable.closest('.section-table').removeClass('__empty');

                        $currentTable.find('._section-summarize').before( $newProductItem );
                        $currentTable.children().eq(-2).find('._counter').counterField({
                            onSetValue: function(value) {
                                updateCalculationInRow( $(this).closest('._order-item') );

                                updateSummarize();
                            }
                        });
                        $currentTable.children().eq(-2).find('._counter-range').counterRange({
                            onSetValue: function(value) {
                                updateCalculationInRow( $(this).closest('._order-item') );

                                updateSummarize();
                            }
                        });
                    } else {
                        $currentTable.append( $newProductItem );
                        $currentTable.children().eq(-1).find('._counter').counterField({
                            onSetValue: function(value) {
                                updateCalculationInRow( $(this).closest('._order-item') );

                                updateSummarize();
                            }
                        });
                    }

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

                $currentTable.on('recalculate', function( e, productRow ){
                    if ( productRow && !$(productRow).length ) {
                        console.error('[Warmex] Передан некорректный объект!');
                        return false;
                    }

                    updateCalculationInRow( $(productRow) );
                    updateSummarize();
                });

                $currentTable.find('._counter').counterField({
                    onSetValue: function(value) {
                        updateCalculationInRow( $(this).closest('._order-item') );

                        updateSummarize();
                    }
                });
                $currentTable.find('._counter-range').counterRange({
                    onSetValue: function(value) {
                        updateCalculationInRow( $(this).closest('._order-item') );

                        updateSummarize();
                    }
                });

                _this.inited = true;

                function updateSimpleCalculationInRow($row) {
                    let $price = $row.find('input._price'), propsSum = $row.find('._features-sum-label').data('sum'),
                        clientSale = parseInt($row.find('input._client-sale').val()),
                        countItems = parseInt($row.find('input._count').val());

                    if ( !$price.hasClass( '._loaded' ) ) {
                        $price.val(calculateResult.counterpartyPrice);
                        $row.find('._price-label').html(WMX.formatAsCurrencyLabel(calculateResult.counterpartyPrice));
                        $row.find('._sum-counterparty-label').data('sum', calculateResult.counterpartySum).html(WMX.formatAsCurrencyLabel(calculateResult.counterpartySum));
                    }
                }

                function updateCalculationInRow($row) {
                    let $price = $row.find('input._price'), propsSum = $row.find('._features-sum-label').data('sum'),
                        countItems = parseInt($row.find('input._count').val());

                    if ( _this._warmex.options.isSimpleCalc ) {
                        if ( $row.hasClass( '_loaded' ) ) {
                            let sum = ( parseFloat( $price.val() ) ? parseFloat( $price.val() ) : 0 ) * countItems;
                            $row.find('._sum-counterparty-label').data('sum', sum).html(WMX.formatAsCurrencyLabel(sum));
                        } else {
                            let price = ( parseFloat( $price.data('rrc') ) ? parseFloat( $price.data('rrc') ) : 0 );
                            propsSum = ( propsSum || 0 );
                            if ( propsSum > 0 ) {
                                price += propsSum;
                            }

                            $price.val(price);
                            $row.find('._price-label').html(WMX.formatAsCurrencyLabel(price));

                            let sum = price * countItems;
                            $row.find('._sum-counterparty-label').data('sum', sum).html(WMX.formatAsCurrencyLabel(sum));
                        }
                    } else {
                        let clientSale = parseInt($row.find('input._client-sale').val());

                        let calculateResult = WMX.calculateSales({
                            counterpartySale: ( _this._warmex.noSale ? 0 : _this._warmex.counterpartySale ),
                            propertySum: ( propsSum || 0 ),
                            clientSale: ( isNaN(clientSale) ? 0 : clientSale ),
                            price: $price.data('rrc'),
                            count: ( isNaN(countItems) ? 0 : countItems ),
                        });

                        $price.val( calculateResult.counterpartyPrice );
                        $row.find('._price-label').html( WMX.formatAsCurrencyLabel( calculateResult.counterpartyPrice ) );
                        $row.find('._sum-counterparty-label').data('sum', calculateResult.counterpartySum).html( WMX.formatAsCurrencyLabel( calculateResult.counterpartySum ) );
                        $row.find('._sum-client-label').data('sum', calculateResult.clientSum).html( WMX.formatAsCurrencyLabel( calculateResult.clientSum ) );
                        $row.find('._sum-income-label').data('sum', calculateResult.counterpartyIncome).html( WMX.formatAsCurrencyLabel( calculateResult.counterpartyIncome ) );
                    }
                }

                function updateSummarize() {
                    if ( _this._warmex.options.isSimpleCalc ) { updateSummarizeSimple(); } else { updateSummarizeFull(); }
                }

                function updateSummarizeSimple () {
                    let $summarizeIncome = $(_this._warmex.options.summarizeSimple);

                    if ( !$summarizeIncome.length ) {
                        console.error('[Warmex] Не удалось найти объект суммы Итого!');
                        return false;
                    }

                    let $tables = _this._warmex.options.form.find( '.'+_this._warmex.options.tablesClass );

                    let itogoIncome = 0;
                    $tables.each((i, table) => {
                        let $rows = $(table).find('._order-item'), tableIncome = 0;

                        if ( $rows.length ) {
                            $rows.each(function (i, row) {
                                tableIncome += $(row).find('._sum-counterparty-label').data('sum');
                            });
                        }

                        itogoIncome += tableIncome;
                    });

                    $summarizeIncome.html( WMX.formatAsCurrencyLabel( WMX.roundAsCurrency( itogoIncome ) ) );
                }

                function updateSummarizeFull() {
                    let $summarizeIncome = $(_this._warmex.options.summarizeIncome);
                    let $summarizeCounterparty = $(_this._warmex.options.summarizeCounterparty);
                    let $summarizeClient = $(_this._warmex.options.summarizeClient);

                    if ( !$summarizeIncome.length || !$summarizeCounterparty.length || !$summarizeClient.length ) {
                        console.error('[Warmex] Не удалось найти объект суммы Итого!');
                        return false;
                    }

                    let $tables = _this._warmex.options.form.find( '.'+_this._warmex.options.tablesClass );

                    let itogoIncome = 0, itogoCounterparty = 0, itogoClient = 0;
                    $tables.each((i, table) => {
                        let $rows = $(table).find('._order-item'), $summaryRow = $(table).find('._section-summarize');
                        let tableIncome = 0, tableCounterparty = 0, tableClient = 0;

                        if ( $rows.length ) {
                            $rows.each(function (i, row) {
                                tableIncome += $(row).find('._sum-income-label').data('sum');
                                tableCounterparty += $(row).find('._sum-counterparty-label').data('sum');
                                tableClient += $(row).find('._sum-client-label').data('sum');
                            });
                        }

                        if ( $summaryRow.length ) {
                            $summaryRow.find('._sum-income-label').data('sum', tableIncome).html(WMX.formatAsCurrencyLabel(WMX.roundAsCurrency(tableIncome)));
                            $summaryRow.find('._sum-counterparty-label').data('sum', tableCounterparty).html(WMX.formatAsCurrencyLabel(WMX.roundAsCurrency(tableCounterparty)));
                            $summaryRow.find('._sum-client-label').data('sum', tableClient).html(WMX.formatAsCurrencyLabel(WMX.roundAsCurrency(tableClient)));
                        }

                        itogoIncome += tableIncome;
                        itogoCounterparty += tableCounterparty;
                        itogoClient += tableClient;
                    });

                    $summarizeIncome.html( WMX.formatAsCurrencyLabel( WMX.roundAsCurrency( itogoIncome ) ) );
                    $summarizeCounterparty.html( WMX.formatAsCurrencyLabel( WMX.roundAsCurrency( itogoCounterparty ) ) );
                    $summarizeClient.html( WMX.formatAsCurrencyLabel( WMX.roundAsCurrency( itogoClient ) ) );
                }

                function appendProduct( $newItem, oProduct, calculateResult ) {
                    let noProductImagePath = '/local/templates/warmex/img/no-product.svg';
                    calculateResult = calculateResult || {};

                    let pricesHtml = `<br/>Цена для клиента: ${WMX.formatAsCurrencyLabel( calculateResult.basePrice )} руб.<br/>
                        Ваша скидка: ${_this._warmex.counterpartySale}%<br/>
                        Ваша цена: ${WMX.formatAsCurrencyLabel( calculateResult.counterpartyProductPrice )} руб.`;

                    let srcImage = oProduct.image || noProductImagePath;
                    let productCell = `<div class="table__td table__td--product table__td--link">
                        <a href="#" class="table__link table__link--show-modal product-link _show-modal" data-content="._products-modal">
                            <div class="product-link__container">
                                <div class="product-link__image">
                                    <img src="${srcImage}" alt="${oProduct.name}">
                                </div>
                                <div class="product-link__title">${oProduct.name} ${(!_this._warmex.options.isSimpleCalc ? pricesHtml : "")}</div>
                            </div>
                            <input type="hidden" class="_product" name="${getFieldNamePrefix(oProduct.rowId)}[NOMENCLATURE]" value="${oProduct.id}">
                        </a>                        
                    </div>`;

                    $newItem.append( productCell );
                }

                function appendFeatures( $newItem, rowId, features ) {
                    let cell = `<div class="table__td table__td--link table__td--features" data-title="Характеристики" >
                            <a href="#" class="table__link table__link--show-modal choose-feature__item" data-content="._features-modal">Выбрать характеристики</a>
                            <input type="hidden" class="_features" name="${getFieldNamePrefix(rowId)}[PROPERTIES]" value="">
                        </div>`;

                    if(!features) {
                        cell = `<div class="table__td table__td--link table__td--features" data-title="Характеристики" >
                            <input type="hidden" class="_features" name="${getFieldNamePrefix(rowId)}[PROPERTIES]" value="">
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

                function appendSectionSummarize( $table ) {
                    let propertyColumn = "";
                    if ( $table.data('type') !== "FITTINGS" ) {
                        propertyColumn = '<div class="table__td table__td--link table__td--features __empty __desktop-only" data-title="Характеристики"></div>';
                    }

                    let row = `<div class="table__tr table__tr--summarize _section-summarize" data-item-id="0"  data-da="._section-table-01,991,last">
                        <div class="table__td table__td--product table__td--link __empty __desktop-only"></div>
                        ${propertyColumn}
                        <div class="table__td table__td--mob-footer table__td--first-footer-row table__td--price __txt-right __desktop-only" data-title="Ваша цена"></div>
                        <div class="table__td table__td--counter __txt-right __desktop-only"></div>
                        <div class="table__td table__td--mob-footer __txt-right" data-title="Итого ваша сумма">
                            <span class="__nowrap __rub _sum-counterparty-label" data-sum="0">0.00</span>
                        </div>
                        <div class="table__td table__td--mob-footer __txt-right __gray-text" data-title="Итого сумма клиенту">
                            <span class="__nowrap __rub _sum-client-label" data-sum="0">0.00</span>
                        </div>
                        <div class="table__td table__td--counter __txt-right __desktop-only"></div>
                        <div class="table__td table__td--mob-footer __txt-right __gray-text" data-title="Итого ваш доход">
                            <span class="__nowrap __rub _sum-income-label" data-sum="0">0.00</span>
                        </div>
                        <div class="table__td table__td--close-icon __txt-right __desktop-only"></div>
                    </div>`;

                    $table.append( row );
                }

                function appendRange( $newItem, rowId ) {
                    let cell = `<div class="table__td table__td--counter __txt-right">
                        <div class="field table-field-range counter-field _counter-range">
                            <span class="counter-field__minus _minus"><i class="icons __icon-subtract-line"></i></span>
                            <input type="tel" class="counter-field__input _input _client-sale" name="${getFieldNamePrefix(rowId)}[CLIENT_PERCENT]" autocomplete="off" value="0" data-min="-99" data-max="99" step="5" />
                            <span class="counter-field__plus _plus"><i class="icons __icon-plus-only"></i></span>
                        </div>
                    </div>`;

                    $newItem.append( cell );
                }

                function appendPrice( $newItem, rowId, priceParam ) {
                    let cell = `<div class="table__td table__td--mob-footer table__td--first-footer-row table__td--price __txt-right" data-title="Ваша цена">
                        <span class="__nowrap __rub _price-label">${WMX.formatAsCurrencyLabel( priceParam.price )}</span>
                        <input type="hidden" class="_price" data-rrc="${priceParam.rrc}" name="${getFieldNamePrefix(rowId)}[PRICE]" value="${priceParam.price}">
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
    },
    calculateSales: function( opts ) {
        opts.price = parseFloat(opts.price);
        opts.propertySum = ( isNaN(parseFloat(opts.propertySum)) ? 0 : parseFloat(opts.propertySum) );
        opts.count = ( parseInt( opts.count ) || 1 );

        let clientSale = ( !isNaN(parseInt(opts.clientSale)) ? Math.abs( parseInt(opts.clientSale) ) : 0 );
        let clientPrice = opts.price + opts.propertySum;
        let clientSum = this.roundAsCurrency( opts.count * clientPrice );

        if ( clientSale > 0 ) {
            let sale = ( ( clientSum * clientSale ) / 100 );
            clientSum = this.roundAsCurrency( opts.clientSale < 0 ? clientSum - sale : clientSum + sale );
        }        

        let counterpartyPrice = opts.price;
        if ( opts.counterpartySale > 0 ) {
            counterpartyPrice = this.roundAsCurrency( (opts.price * (100 - opts.counterpartySale) ) / 100 )
        }
        let counterpartyProductPrice = counterpartyPrice;
        counterpartyPrice += opts.propertySum;

        let counterpartySum = this.roundAsCurrency( opts.count * counterpartyPrice );
        
        return {
            basePrice: opts.price,
            counterpartyProductPrice: counterpartyProductPrice,
            counterpartyPrice: counterpartyPrice,
            counterpartySum: counterpartySum,
            counterpartyIncome: clientSum - counterpartySum,
            clientSum: clientSum,
        };
    },
    roundAsCurrency: function(number) {
        return Math.round(number * 100) / 100;
    },
    formatAsCurrencyLabel: function(number, decimal) {
        decimal = decimal || 0;
        return this.number_format( number, decimal, ".", "&nbsp;" );
    }
}
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle
// https://github.com/FreelancerLifeStyle/dynamic_adapt/blob/master/dynamicAdapt.js

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

$(document).ready(function(){
    /// init plugins
    $('._tabs').tabs();
    $('._counter').counterField();
    $('._counter-range').counterRange();
    // $('._counter').trigger('switchDisabled', true);
    // $('._counter').trigger('switchError', true);
    $('.inputRadio, .inputCheckbox, .inputSelect').styler({
        selectSearch: true
    });
    $('._tooltip').tooltipster({
        theme: "tooltipster-warmex",
        maxWidth: 256,
        trigger: 'hover'
    });
    $('._tooltip-black').tooltipster({
        theme: "tooltipster-warmex-black",
        maxWidth: 256,
        trigger: 'hover'
    });
    Fancybox.bind("[data-fancybox]");
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
    .on('refresh', '._characteristic-choose input.inputCheckbox', function(){
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
        
        if ( $input.val().length < 1 ) {
            if ( $container.hasClass('_filtered') ) {
                resetSearch( true );
            }

            return false;
        }       
        

        let inputValue = $input.val().toLowerCase().split(' ').filter(e => e.length);

        $icon.addClass('__icon-close-only').removeClass('__icon-search');
        $container.find('.__last-flex').removeClass('__last-flex');
        $container.find('._filter-item').each((i, el) => {
            let $item = $(el), valueEl = $item.find('._filter-value').html().toLowerCase();

            let resFilter = inputValue.filter(keyword => {
                return !!~(valueEl.indexOf( keyword ));
            });
        
            if ( resFilter.length && resFilter.length === inputValue.length ) {
                $item.show();
            } else {
                $item.hide();
            }
        });
        $container.find('._filter-item:visible').eq(-1).addClass('__last-flex');
        $container.addClass('_filtered');

        if ( !$icon.hasClass('_inited') ) {
            $input.on('wmx.clear', () => { resetSearch(); });
            $icon.on('click', () => { resetSearch(); });
            $icon.addClass('_inited');
        }

        function resetSearch(forceReset) {
            forceReset = forceReset || false;

            if ( $input.val().length || forceReset ) {
                $input.val('');
                $icon.removeClass('__icon-close-only').addClass('__icon-search');
                $container.find('._filter-item').show();
                $container.find('.__last-flex').removeClass('__last-flex');
                $container.removeClass('_filtered');
            }
        }
    });

    let $videoBlocks = $('._youtube-video');

    if ( $videoBlocks.length ) {
        $videoBlocks.each((i, el) => {
            let code = $(el).data('video');
            $(el).append( `<img src="https://img.youtube.com/vi/${code}/hqdefault.jpg"  alt=""><div class="video-block__play _play"></div>` );
        });

        $(document).on('click', '._youtube-video', function(e){
            let $c = $(this), code = $c.data('video');

            $c.append(`<iframe src="https://www.youtube.com/embed/${code}?controls=0&autoplay=1" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; autoplay" allowfullscreen></iframe>`);
            $c.find('img').remove();
            $c.find('._play').remove();
            setTimeout(() => {
                $c.addClass('__active');
            }, 1000);            
        });
    }



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
            summarizeCounterparty: $orderForm.find('._summarize-counterparty'),
            summarizeClient: $orderForm.find('._summarize-client'),
            summarizeIncome: $orderForm.find('._summarize-income')
        });
        
        /*$('._add-product').click(function(){
            // добавление записи в таблицу
            $(this).closest('.section-table').find('._order-table').trigger('appendPosition', {
                id: 12,
                name: 'Дверное полотно ZARGO Duo 600 скандинавский дуб с/о (армированное)',
                image: '/img/trash/order/product-01.jpg',
                price: 12123
            });
        });*/

        $(document).on('click', '.choose-produts__item._product', function () {
            const $orderForm = $('._order-form');
            if ($orderForm.length) {
                $('.modal.open').trigger('close');

                var $this = $(this);
                // добавление записи в таблицу
                $orderForm.find('._order-table.'+$this.data('type')).trigger('appendPosition', {
                    id: $this.data('nomenclature'),
                    name: $this.data('name'),
                    features: $this.data('features'),
                    image: $this.data('image')||'img/no-product.svg',
                    price: $this.data('price')
                });
            }
        })
    }
});