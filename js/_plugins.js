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
                    }
                    $input.val( _that._settings.min );
                    $removeBtn.addClass('_disabled');

                    $field.on('reset', reset).on('refresh', refresh)
                    .on('switchDisabled', function(e, bDisabled){
                        bDisabled = bDisabled || false;

                        if ( bDisabled ) {
                            $field.addClass('counter-field--disabled');
                            $input.prop('disabled', true);
                        } else {
                            $field.removeClass('counter-field--disabled');
                            $input.prop('disabled', false);
                        }
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

                function setValue( value, bRunTrigger ) {
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
                    }
                    setValue( _that._settings.min, false );
                }

                function refresh() {
                    _that._settings.min = parseInt( $input.data('min') ) || 1;
                    _that._settings.max = parseInt( $input.data('max') );

                    if ( _that._settings.lastValue < _that._settings.min || _that._settings.lastValue > _that._settings.max ) {
                        setValue( _that._settings.min, false );
                        _that._settings.lastValue = _that._settings.min;
                    }
                }
            });
        };
    });
})(jQuery);