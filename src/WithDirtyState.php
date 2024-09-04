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
        $this->dispatch('setDirty', name: self::getName(), value: $value);
        $this->dispatch('setCloseConfirmationText', name: self::getName(), value: trans('Are you sure you want to discard all the changes?'));
    }
}
