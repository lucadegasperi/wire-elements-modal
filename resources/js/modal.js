window.LivewireUIModal = () => {
    return {
        show: false,
        showActiveComponent: true,
        activeComponent: false,
        componentHistory: [],
        modalWidth: null,
        isDirty: false,
        getActiveComponentModalAttribute(key) {
            if (this.$wire.get('components')[this.activeComponent] !== undefined) {
                return this.$wire.get('components')[this.activeComponent]['modalAttributes'][key];
            }
        },
        closeModalOnEscape(trigger) {

            if (this.getActiveComponentModalAttribute('closeOnEscape') === false) {
                return;
            }

            let force = this.getActiveComponentModalAttribute('closeOnEscapeIsForceful') === true;
            this.confirmCloseModal(force);
        },
        closeModalOnClickAway(trigger) {
            if (this.getActiveComponentModalAttribute('closeOnClickAway') === false) {
                return;
            }

            this.confirmCloseModal(true);
        },
        confirmCloseModal(force = false, skipPreviousModals = 0, destroySkipped = false) {
            if (this.show === false) {
                return;
            }

            if (this.isDirty) {
                setTimeout(() => confirm('Sei sicuro?') ? this.closeModal(force, skipPreviousModals, destroySkipped) : null, 100);
                return;
            } else {
                this.closeModal(force, skipPreviousModals, destroySkipped);
            }
        },
        closeModal(force = false, skipPreviousModals = 0, destroySkipped = false) {
            if (this.show === false) {
                return;
            }

            if (this.getActiveComponentModalAttribute('dispatchCloseEvent') === true) {
                const componentName = this.$wire.get('components')[this.activeComponent].name;
                Livewire.emit('modalClosed', componentName);
            }

            if (this.getActiveComponentModalAttribute('destroyOnClose') === true) {
                Livewire.emit('destroyComponent', this.activeComponent);
            }

            if (skipPreviousModals > 0) {
                for (var i = 0; i < skipPreviousModals; i++) {
                    if (destroySkipped) {
                        const id = this.componentHistory[this.componentHistory.length - 1];
                        Livewire.emit('destroyComponent', id);
                    }
                    this.componentHistory.pop();
                }
            }

            const id = this.componentHistory.pop();

            if (id && force === false) {
                if (id) {
                    this.setActiveModalComponent(id, true);
                } else {
                    this.setShowPropertyTo(false);
                }
            } else {
                this.setShowPropertyTo(false);
            }

            this.isDirty = false;
        },
        setActiveModalComponent(id, skip = false) {
            this.setShowPropertyTo(true);

            if (this.activeComponent === id) {
                return;
            }

            if (this.activeComponent !== false && skip === false) {
                this.componentHistory.push(this.activeComponent);
            }

            let focusableTimeout = 50;

            if (this.activeComponent === false) {
                this.activeComponent = id
                this.showActiveComponent = true;
                this.modalWidth = this.getActiveComponentModalAttribute('maxWidthClass');
            } else {
                this.showActiveComponent = false;

                focusableTimeout = 400;

                setTimeout(() => {
                    this.activeComponent = id;
                    this.showActiveComponent = true;
                    this.modalWidth = this.getActiveComponentModalAttribute('maxWidthClass');
                }, 300);
            }
        },
        setShowPropertyTo(show) {
            this.show = show;

            if (show) {
                document.body.classList.add('overflow-y-hidden');
            } else {
                document.body.classList.remove('overflow-y-hidden');

                setTimeout(() => {
                    this.activeComponent = false;
                    this.$wire.resetState();
                }, 300);
            }
        },
        init() {

            console.log('here');

            this.modalWidth = this.getActiveComponentModalAttribute('maxWidthClass');

            Livewire.on('setDirty', (id, value) => {
                this.isDirty = value;
            });

            Livewire.on('closeModal', (force = false, skipPreviousModals = 0, destroySkipped = false) => {
                this.confirmCloseModal(force, skipPreviousModals, destroySkipped);
            });

            Livewire.on('activeModalComponentChanged', (id) => {
                this.setActiveModalComponent(id);
            });
        }
    };
}
