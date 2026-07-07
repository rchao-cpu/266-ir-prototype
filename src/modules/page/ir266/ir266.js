import { LightningElement, track } from 'lwc';

export default class Ir266 extends LightningElement {
    @track currentStep = 0; // 0=PreConfig (includes route selection), 1-3=Config steps
    @track selectedRoute = null; // 'unify', 'mdm', 'datakit'
    @track selectedStrategy = 'conservative'; // 'conservative', 'typical', 'loose', 'custom'
    @track showSideNav = true;
    @track showChatPanel = false;
    @track estimatedCredits = 2450;
    @track showConfigSteps = false; // Only show config steps after clicking Next from step 0

    get showChatFab() {
        return !this.showChatPanel;
    }

    get isFirstStep() {
        return this.currentStep === 0;
    }

    get showExpandButton() {
        return !this.showSideNav;
    }

    get alwaysShowSteps() {
        return true;
    }

    // Route selection visual feedback
    get isUnifySelected() {
        return this.selectedRoute === 'unify';
    }

    get isMdmSelected() {
        return this.selectedRoute === 'mdm';
    }

    get isDatakitSelected() {
        return this.selectedRoute === 'datakit';
    }

    get getRouteCardClass() {
        return this.selectedRoute === 'unify' ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
    }

    get getMdmCardClass() {
        return this.selectedRoute === 'mdm' ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
    }

    get getDatakitCardClass() {
        return this.selectedRoute === 'datakit' ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
    }

    // Navigation classes for step cards
    get preConfigCardClass() {
        return this.currentStep === 0 ? 'step-card step-card-active' : 'step-card';
    }

    get step1CardClass() {
        return this.currentStep === 1 ? 'step-card step-card-active' : 'step-card';
    }

    get step2CardClass() {
        return this.currentStep === 2 ? 'step-card step-card-active' : 'step-card';
    }

    get step3CardClass() {
        return this.currentStep === 3 ? 'step-card step-card-active' : 'step-card';
    }

    // Badge labels for step cards
    get preConfigBadge() {
        return this.currentStep > 0 ? 'READY' : 'ACTIVE';
    }

    get routeBadge() {
        if (this.currentStep > 1) return 'READY';
        if (this.currentStep === 1) return 'ACTIVE';
        return 'READY';
    }

    get step1Badge() {
        if (this.currentStep > 2) return 'READY';
        if (this.currentStep === 2) return 'ACTIVE';
        return '';
    }

    get step2Badge() {
        if (this.currentStep > 3) return 'READY';
        if (this.currentStep === 3) return 'ACTIVE';
        return '';
    }

    get step3Badge() {
        if (this.currentStep > 4) return 'READY';
        if (this.currentStep === 4) return 'ACTIVE';
        return '';
    }

    get step4Badge() {
        if (this.currentStep > 5) return 'READY';
        if (this.currentStep === 5) return 'ACTIVE';
        return '';
    }

    // Step visibility
    get isPreConfig() {
        return this.currentStep === 0;
    }

    get isStep1() {
        return this.currentStep === 1;
    }

    get isStep2() {
        return this.currentStep === 2;
    }

    get isStep3() {
        return this.currentStep === 3 && this.selectedRoute === 'unify';
    }

    // Route-specific logic
    get showStep4() {
        return true; // Always show Step 3 in nav
    }

    get step2Required() {
        return this.selectedRoute === 'mdm';
    }

    get step2Title() {
        return this.step2Required ? 'Step 2 — Configurations' : 'Step 2 — Optional Configurations';
    }

    get currentStepTitle() {
        const titles = {
            0: 'Pre-Configuration',
            1: 'Step 1: Select Unification Type',
            2: this.step2Required ? 'Step 2: Trusted Sources (Required)' : 'Step 2: Trusted Sources (Optional)',
            3: 'Step 3: Generate Match Rules'
        };
        return titles[this.currentStep] || '';
    }

    get currentStepSubtitle() {
        const subtitles = {
            0: 'Set up DMO, mappings, and validate data quality',
            1: 'What records will this ruleset consolidate?',
            2: this.step2Required
                ? 'Select Data Lake Object for trusted sources'
                : 'Optional: Designate authoritative data sources',
            3: 'Choose match rule strategy or create custom rules'
        };
        return subtitles[this.currentStep] || '';
    }

    get nextButtonLabel() {
        // Step 0: Next
        if (this.currentStep === 0) {
            return 'Next';
        }
        // Step 2 (Trusted Sources) for MDM route: Create Ruleset
        if (this.currentStep === 2 && this.selectedRoute === 'mdm') {
            return 'Create Ruleset';
        }
        // Step 3 (Match Rules) for Unify route: Create Ruleset
        if (this.currentStep === 3 && this.selectedRoute === 'unify') {
            return 'Create Ruleset';
        }
        // All other steps: Next
        return 'Next';
    }

    get showNextButton() {
        return true; // Always show Next button
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
        // Don't auto-advance - user must click Next
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
        // Step 0: Must have route selected before proceeding
        if (this.currentStep === 0 && !this.selectedRoute) {
            alert('Please select a ruleset creation method');
            return;
        }

        // Skip Step 3 if MDM route (no match rules step)
        if (this.currentStep === 2 && this.selectedRoute === 'mdm') {
            // Complete: create ruleset
            console.log('MDM Ruleset created');
            return;
        }

        if (this.currentStep === 3 && this.selectedRoute === 'unify') {
            // Complete: create ruleset
            console.log('Ruleset created');
        } else if (this.currentStep < 3) {
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

    // Match strategy selection
    handleStrategySelect(event) {
        const strategy = event.currentTarget.dataset.strategy;
        this.selectedStrategy = strategy;
    }

    get isConservativeSelected() {
        return this.selectedStrategy === 'conservative';
    }

    get isTypicalSelected() {
        return this.selectedStrategy === 'typical';
    }

    get isLooseSelected() {
        return this.selectedStrategy === 'loose';
    }

    get isCustomSelected() {
        return this.selectedStrategy === 'custom';
    }

    get conservativeCardClass() {
        return this.isConservativeSelected ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
    }

    get typicalCardClass() {
        return this.isTypicalSelected ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
    }

    get looseCardClass() {
        return this.isLooseSelected ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
    }

    get customCardClass() {
        return this.isCustomSelected ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
    }

    get showRecommendedRules() {
        return this.selectedStrategy !== 'custom';
    }

    get recommendedRulesTitle() {
        const counts = {
            conservative: 3,
            typical: 5,
            loose: 7
        };
        const count = counts[this.selectedStrategy] || 0;
        return `Recommended Match Rules (${count})`;
    }

    get matchRules() {
        const rules = {
            conservative: [
                {
                    id: '1',
                    title: 'Exact Name with Email and Phone',
                    description: 'Matches profiles with identical first and last names, plus matching email and phone number',
                    showOr: false
                },
                {
                    id: '2',
                    title: 'Exact Name with Address and Phone',
                    description: 'Matches profiles with identical names, plus matching address and phone number',
                    showOr: true
                },
                {
                    id: '3',
                    title: 'Fuzzy Name with Exact SSN',
                    description: 'Matches profiles with similar names (accounting for typos) and identical Social Security Number',
                    showOr: true
                }
            ],
            typical: [
                {
                    id: '1',
                    title: 'Fuzzy Name with Email and Phone',
                    description: 'Matches profiles with similar names, plus matching email and phone',
                    showOr: false
                },
                {
                    id: '2',
                    title: 'Fuzzy Name with Address and Phone',
                    description: 'Matches profiles with similar names, plus matching address and phone',
                    showOr: true
                },
                {
                    id: '3',
                    title: 'Email Match with Phone',
                    description: 'Matches profiles with identical email addresses and phone numbers',
                    showOr: true
                },
                {
                    id: '4',
                    title: 'Fuzzy Name with Exact DOB',
                    description: 'Matches profiles with similar names and identical date of birth',
                    showOr: true
                },
                {
                    id: '5',
                    title: 'Phone Match with Address',
                    description: 'Matches profiles with identical phone numbers and matching addresses',
                    showOr: true
                }
            ],
            loose: [
                {
                    id: '1',
                    title: 'Fuzzy Name with Email',
                    description: 'Matches profiles with similar names and matching email addresses',
                    showOr: false
                },
                {
                    id: '2',
                    title: 'Fuzzy Name with Phone',
                    description: 'Matches profiles with similar names and matching phone numbers',
                    showOr: true
                },
                {
                    id: '3',
                    title: 'Email Only Match',
                    description: 'Matches profiles with identical email addresses',
                    showOr: true
                },
                {
                    id: '4',
                    title: 'Phone Only Match',
                    description: 'Matches profiles with identical phone numbers',
                    showOr: true
                },
                {
                    id: '5',
                    title: 'Fuzzy Name with Partial Address',
                    description: 'Matches profiles with similar names and matching city/state',
                    showOr: true
                },
                {
                    id: '6',
                    title: 'Last Name with DOB',
                    description: 'Matches profiles with identical last names and date of birth',
                    showOr: true
                },
                {
                    id: '7',
                    title: 'Address Match with Household',
                    description: 'Matches profiles with identical addresses regardless of name differences',
                    showOr: true
                }
            ]
        };
        return rules[this.selectedStrategy] || [];
    }
}
