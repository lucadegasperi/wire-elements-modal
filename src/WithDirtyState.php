<?php


namespace LivewireUI\Modal;

trait WithDirtyState
{
    protected $skipDirtyCheck = [];

    public function updated($name, $value)
    {
        if(in_array($name, $this->skipDirtyCheck)) {
            return;
        }
        $this->setDirty(true);
    }

    protected function setDirty($value)
    {
        $this->emit('setDirty', self::getName(), $value);
        $this->emit('setCloseConfirmationText', self::getName(), trans('Are you sure you want to discard all the changes?'));
    }
}
