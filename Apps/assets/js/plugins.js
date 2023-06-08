(function($) {
    $(function() {
        $.fn.multiSelect = function(initOptions) {
            $(this).each(function() {
                let _that = this;

                if ( _that._inited ) {
                    return false;
                }

                _that._plugin = {};
                _that._plugin.options = initOptions || {};

                let $oSelectBox = $( this ),
                    $selectLabel = $oSelectBox.find('._label' ),
                    $dropdown = $oSelectBox.find('._dropdown' ),
                    $dropdownFilter = $oSelectBox.find('._filter' );

                let getItems = (selected) => {
                    return $dropdown.find('._items ._item' + (selected ? '._selected' : ''));
                }

                $selectLabel.on('click', function( e ){
                    if ( $( e.target ).hasClass( "_remove-bubble" ) ) {
                        return e.preventDefault();
                    }

                    if ( !_that._plugin.isDisabled ) {
                        $dropdown.toggleClass('__showed');
                    }
                });

                let $notFoundItem = $(`<div class="multiple-select__item select-item __empty _not-found-item">
                        <div class="select-item__container">
                            <div class="select-item__body">
                                <div class="select-item__hint">Не найдено ни одного элемента</div>
                            </div>
                        </div>
                    </div>`);
                let $itemsContainer = $dropdown.find('._items');
                $dropdownFilter.find('input').on('input', function() {
                    let query = $(this).val().toLowerCase();

                    let $items = getItems();
                    if ( !$items.length ) {
                        console.error('[multiple-select] Not found items!');
                        return false;
                    }

                    if ( !query.length ) {
                        $items.show();
                        $itemsContainer.find('._not-found-item').remove();
                    } else {
                        let bEmpty = true;
                        $items.each((i, el) => {
                            let $item = $(el);

                            let title = $item.find('._item-title').text().toLowerCase();
                            let code = $item.find('input').data('code').toString();
                            let value = $item.find('input').val();

                            if ( code === query || value === query ) {
                                $item.show();
                                bEmpty = false;
                            } else if ( title.includes( query ) ) {
                                $item.show();
                                bEmpty = false;
                            } else {
                                $item.hide();
                            }
                        });

                        if ( bEmpty ) {
                            $itemsContainer.append( $notFoundItem );
                        } else {
                            $itemsContainer.find('._not-found-item').remove();
                        }
                    }
                });

                $oSelectBox.on( 'click', '._remove-bubble', function(e) {
                    if ( _that._plugin.isDisabled ) {
                        e.preventDefault();
                    }

                    let itemId = $(this).data('itemId').toString();

                    getItems().each((i, el) => {
                        let $itemInput = $(el).find('input');
                        if ( $itemInput.val() === itemId ) {
                            $itemInput.prop('checked', false).trigger('change');
                        }
                    });
                });

                $dropdown.on('change', '._item input[type=checkbox]', itemChange);
                function itemChange(){
                    if ( _that._plugin.isDisabled ) {
                        return false;
                    }
                    
                    var chBox = $( this ),
                        $item = chBox.closest('._item');

                    if ( chBox.prop('checked') ) {
                        $item.addClass('_selected');
                    } else {
                        $item.removeClass('_selected');
                    }

                    if ( $oSelectBox.find('._items ._item._selected').length > 0 ) {
                        $oSelectBox.removeClass('_empty');
                    } else {
                        $oSelectBox.addClass('_empty');
                    }

                    //$oSelectBox.trigger('validate');
                    renderBubbles();

                    if ( _that._plugin.options.onItemChange ) {
                        _that._plugin.options.onItemChange.call( this, $item, chBox.prop('checked') );
                    }
                }

                function renderBubbles() {
                    let $selectedItems = getItems('selected');
                
                    if ( !$selectedItems.length ) {
                        if ( $selectLabel.find('._bubbles').length ) {
                            $selectLabel.find('._bubbles').remove();
                        }

                        return false;
                    }

                    if ( !$selectLabel.find('._bubbles').length ) {
                        $selectLabel.append('<div class="multiple-select__selected-items _bubbles"></div>');
                    }

                    let $bublesContainer = $selectLabel.find('._bubbles');
                    $bublesContainer.html('');
                    $selectedItems.each((i, item) => {
                        let $item = $(item);
                        let title = $item.find('._item-title').text();
                        let hint = $item.find('._item-hint').text();
                        let itemId = $item.find('input').val();

                        let $bubble = $(`<div class="multiple-select__selected-item item-selected">
                                <div class="item-selected__label" title="${hint}">${title}</div>
                                <div class="item-selected__remove _remove-bubble" data-item-id="${itemId}"></div>
                            </div>`);

                        $bublesContainer.append( $bubble );
                    });

                    if ( $oSelectBox.hasClass('_empty') ) {
                        $oSelectBox.removeClass('_empty');
                    }
                }

                $( 'body' ).on( "click tap touchstart", function ( e ) {
                    if ( $( e.target ).hasClass( "_remove-bubble" ) ) {
                        return e.preventDefault();
                    }

                    if ( !$( e.target ).closest( ".multiple-select._container" ).length ) {
                        $dropdown.removeClass('__showed');
                    }
                } );

                $oSelectBox.on('disable', function( e, bSwitchOn ){
                    var $c = $(this);

                    if ( bSwitchOn === true ) {
                        $c.addClass('__disabled');
                        _that._plugin.isDisabled = true;
                    } else {
                        $c.removeClass('__disabled');
                        _that._plugin.isDisabled = false;
                    }
                });

                _that._plugin.isDisabled = ( $oSelectBox.hasClass('__disabled') );
                $selectLabel.attr('data-text', ( $oSelectBox.data('placeholder') || "" ) );
                renderBubbles();

                _that._inited
            });
        };
    });
})(jQuery);

$(document).ready(function(){
    $('.multiple-select').multiSelect();

    $('._settings-action').on('change', function(e) {
        let action = $(this).val(), $form = $(this).closest('form'), $check = $(this);

        let $additionalSettings = $form.find(`._additional-${action}-settings`);
        if ( $additionalSettings.length ) {
            if ( $check.prop('checked') ) {
                $additionalSettings.removeClass('__hidden').find('input, select, textarea').prop('disabled', false);
            } else {
                $additionalSettings.addClass('__hidden').find('input, select, textarea').prop('disabled', true);
            }
        }

        if ( $form.find('._settings-action:checked').length ) {
            $form.find('._restrict-field').removeClass('__hidden')
                .find(".multiple-select").trigger('disable', false);
        } else {
            $form.find('._restrict-field').addClass('__hidden')
                .find(".multiple-select").trigger('disable', true);
        }

        e.preventDefault();
    }).eq(0).trigger('change');
});