import { LightningElement, track } from 'lwc';

export default class Ir266 extends LightningElement {
    @track currentStep = 0; // 0=PreConfig, 1=ChooseRoute, 2-5=Config steps
    @track selectedRoute = null; // 'unify', 'mdm', 'datakit'
    @track showSideNav = true;
    @track showChatPanel = false;
    @track estimatedCredits = 2450;

    get showChatFab() {
        return !this.showChatPanel;
    }

    // Navigation classes
    get preConfigClass() {
        return this.currentStep === 0 ? 'slds-nav-vertical__item slds-is-active' : 'slds-nav-vertical__item';
    }

    get routeSelectionClass() {
        return this.currentStep === 1 ? 'slds-nav-vertical__item slds-is-active' : 'slds-nav-vertical__item';
    }

    get step1Class() {
        return this.currentStep === 2 ? 'slds-nav-vertical__item slds-is-active' : 'slds-nav-vertical__item';
    }

    get step2Class() {
        return this.currentStep === 3 ? 'slds-nav-vertical__item slds-is-active' : 'slds-nav-vertical__item';
    }

    get step3Class() {
        return this.currentStep === 4 ? 'slds-nav-vertical__item slds-is-active' : 'slds-nav-vertical__item';
    }

    get step4Class() {
        return this.currentStep === 5 ? 'slds-nav-vertical__item slds-is-active' : 'slds-nav-vertical__item';
    }

    // Step visibility
    get isPreConfig() {
        return this.currentStep === 0;
    }

    get isRouteSelection() {
        return this.currentStep === 1;
    }

    get isStep1() {
        return this.currentStep === 2;
    }

    get isStep2() {
        return this.currentStep === 3;
    }

    get isStep3() {
        return this.currentStep === 4;
    }

    get isStep4() {
        return this.currentStep === 5 && this.selectedRoute === 'unify';
    }

    // Route-specific logic
    get showStep4() {
        return this.selectedRoute === 'unify';
    }

    get step3Required() {
        return this.selectedRoute === 'mdm';
    }

    get step3Label() {
        return this.step3Required ? 'Trusted Sources (Required)' : 'Trusted Sources';
    }

    get currentStepTitle() {
        const titles = {
            0: 'Pre-Configuration',
            1: 'Create New Ruleset',
            2: 'Step 1: Select Unification Type',
            3: 'Step 2: Basic Details',
            4: this.step3Required ? 'Step 3: Trusted Sources (Required)' : 'Step 3: Trusted Sources (Optional)',
            5: 'Step 4: Generate Match Rules'
        };
        return titles[this.currentStep] || '';
    }

    get currentStepSubtitle() {
        const subtitles = {
            0: 'Set up DMO, mappings, and validate data quality',
            1: 'Choose how to create your identity resolution ruleset',
            2: 'What records will this ruleset consolidate?',
            3: 'Name your ruleset and select primary DMO',
            4: this.step3Required
                ? 'Select Data Lake Object for trusted sources'
                : 'Optional: Designate authoritative data sources',
            5: 'Choose match rule strategy or create custom rules'
        };
        return subtitles[this.currentStep] || '';
    }

    get nextButtonLabel() {
        if (this.currentStep === 0) {
            return 'Next';
        }
        if (this.currentStep === 1) {
            return null; // Route selection has its own buttons
        }
        if (this.currentStep === 5 || (this.currentStep === 4 && this.selectedRoute === 'mdm')) {
            return 'Create Ruleset';
        }
        if (this.currentStep === 4 && this.selectedRoute === 'unify') {
            return 'Next';
        }
        return 'Next';
    }

    get showNextButton() {
        return this.currentStep !== 1; // Hide on route selection
    }

    get strategyOptions() {
        return [
            { label: 'Conservative', value: 'conservative' },
            { label: 'Typical', value: 'typical' },
            { label: 'Loose', value: 'loose' }
        ];
    }

    get dmoOptions() {
        return [
            { label: 'Individual DMO', value: 'individual' },
            { label: 'Account DMO', value: 'account' },
            { label: 'Household DMO', value: 'household' },
            { label: 'Contact DMO', value: 'contact' },
            { label: 'Lead DMO', value: 'lead' }
        ];
    }

    get dloOptions() {
        return [
            { label: 'CRM Data Lake Object', value: 'crm_dlo' },
            { label: 'SFMC Data Lake Object', value: 'sfmc_dlo' },
            { label: 'Loyalty Data Lake Object', value: 'loyalty_dlo' },
            { label: 'Commerce Data Lake Object', value: 'commerce_dlo' },
            { label: 'Service Data Lake Object', value: 'service_dlo' }
        ];
    }

    // Route selection handlers
    handleRouteSelect(event) {
        const route = event.currentTarget.dataset.route;
        this.selectedRoute = route;
        this.currentStep = 2; // Move to Step 1
    }

    handleStepClick(event) {
        const step = parseInt(event.currentTarget.dataset.step, 10);
        this.currentStep = step;
    }

    handleBack() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
        if (this.currentStep === 1) {
            this.selectedRoute = null;
        }
    }

    handleNext() {
        // Skip Step 4 if MDM route
        if (this.currentStep === 4 && this.selectedRoute === 'mdm') {
            // Complete: create ruleset
            console.log('MDM Ruleset created');
            return;
        }

        if (this.currentStep === 5) {
            // Complete: create ruleset
            console.log('Ruleset created');
        } else {
            this.currentStep++;
        }
    }

    handleCollapseSideNav() {
        this.showSideNav = false;
    }

    handleExpandSideNav() {
        this.showSideNav = true;
    }

    handleOpenChat() {
        this.showChatPanel = true;
    }

    handleCloseChat() {
        this.showChatPanel = false;
    }

    handleShowCreditBreakdown() {
        // Open modal with credit breakdown
        console.log('Show credit breakdown modal');
    }
}
