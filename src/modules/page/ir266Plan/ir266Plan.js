import { LightningElement, track } from 'lwc';
import PreviewResultsModal from 'ui/previewResultsModal';
import { navigate } from '../../../router';

export default class Ir266Plan extends LightningElement {
    @track scenario = 1; // 1 = Excellent, 2 = Needs Fixing
    @track selectedFix = null; // 'auto' | 'guided'
    @track showLandingPage = true; // Show landing page initially
    @track currentStep = 1; // 1=Select Unification, 2=Trusted Sources, 3=Match Rules, 4=Operate & Certify
    @track selectedRoute = null; // 'unify', 'mdm', 'datakit'
    @track selectedStrategy = 'conservative'; // 'conservative', 'typical', 'loose', 'custom'
    @track showSideNav = true;
    @track showChatPanel = false;
    @track estimatedCredits = 2450;
    @track showConfigSteps = false; // Only show config steps after clicking Next from step 0
    @track dataQualityExpanded = false; // Data Quality card expansion state
    @track showSuccessNotification = false; // Success notification state
    @track successMessage = ''; // Success message text
    @track individualDlo = ''; // Individual DLO selection
    @track contactPointAddress = ''; // Contact Point Address selection
    @track contactPointApp = ''; // Contact Point App selection
    @track contactPointEmail = ''; // Contact Point Email selection
    @track contactPointSocial = ''; // Contact Point Social selection
    @track contactPointPhone = ''; // Contact Point Phone selection
    @track partyId = ''; // Party ID selection
    @track activeResolutionTab = 'summary'; // 'summary' or 'history'
    @track trendDuration = '7';
    @track showMoreJobs = false; // Show additional 50 jobs
    @track showOperateCertify = false; // True after saving the ruleset setup
    @track showRulesetList = false; // True after first ruleset is created
    @track isEditMode = false; // True when editing from record home
    @track isBeginDropdownOpen = false;
    @track caseSensitive = false;
    @track guidanceExpanded = true;
    @track expandedReconDmos = {};
    @track jobRunMode = null; // 'automatic' | 'manual'
    // Track which contact point fields have been manually overridden
    _manuallySet = new Set();

    get showChatFab() {
        return !this.showChatPanel;
    }

    get isFirstStep() {
        return this.currentStep === 1 && !this.showLandingPage;
    }

    get showExpandButton() {
        return !this.showSideNav;
    }

    get showStepNavAndContent() {
        return (!this.showLandingPage && !this.showOperateCertify) || this.isEditMode;
    }

    get showOptionalSteps() {
        return !this.isEditMode;
    }

    get showStepNavColumn() {
        return this.showStepNavAndContent;
    }

    get showRecommendationBanners() {
        return !this.isEditMode;
    }

    get individualPickerClass() {
        if (this.isEditMode) return 'visual-picker-card visual-picker-selected visual-picker-card_disabled';
        return 'visual-picker-card visual-picker-selected';
    }

    get isIndividualPickerSelected() {
        return true;
    }

    get pickerDisabledClass() {
        return this.isEditMode
            ? 'visual-picker-card visual-picker-card_disabled'
            : 'visual-picker-card';
    }

    get showStep3DockedFooter() {
        return !this.isEditMode && !this.showLandingPage && !this.showOperateCertify;
    }

    get showOperateCertifyContent() {
        return this.showOperateCertify;
    }

    get showCreateRuleset() {
        return !this.showRulesetList;
    }

    get isBackDisabled() {
        return this.currentStep === 1;
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

    // Step completion: step 1 requires a selected route + autofilled fields (always true once in flow)
    // step 2 requires individualDlo, step 3 requires a strategy (always has default)
    get step1Complete() {
        return !!this.selectedRoute;
    }

    get step2Complete() {
        return this.currentStep > 2 && !!this.individualDlo;
    }

    get step3Complete() {
        return this.currentStep > 3;
    }

    // Navigation classes for step cards
    get step1CardClass() {
        return this.currentStep === 1 ? 'step-card step-card-active' : 'step-card';
    }

    get step2CardClass() {
        return this.currentStep === 2 ? 'step-card step-card-active' : 'step-card';
    }

    get step3CardClass() {
        return this.currentStep === 3 ? 'step-card step-card-active' : 'step-card';
    }

    get step4CardClass() {
        return this.currentStep === 4 ? 'step-card step-card-active' : 'step-card';
    }

    get step5CardClass() {
        return this.currentStep === 5 ? 'step-card step-card-active' : 'step-card';
    }

    get step6CardClass() {
        return this.currentStep === 6 ? 'step-card step-card-active' : 'step-card';
    }

    // Step visibility
    // Step 1: Select Unification Type
    // Step 2: Job Schedule (Required Setup)
    // Step 3: Trusted Sources (Optional)
    // Step 4: Generate Match Rules (Optional)
    // Step 5: Generate Reconciliation Rules (Optional)
    // Step 6: Set Up Filters (Optional)
    get isStep1() {
        return this.currentStep === 1;
    }

    get isStep2() {
        return this.currentStep === 2;
    }

    get isStep3() {
        return this.currentStep === 3;
    }

    get isStep4() {
        return this.currentStep === 4;
    }

    get isStep5() {
        return this.currentStep === 5;
    }

    get isStep6() {
        return this.currentStep === 6;
    }

    get isOperateCertify() {
        return this.currentStep === 7;
    }

    get operateCertifyCardClass() {
        return this.currentStep === 7 ? 'step-card step-card-active' : 'step-card';
    }

    // Route-specific logic
    get showStep4() {
        return true; // Always show Step 3 in nav
    }

    get step2Required() {
        return this.selectedRoute === 'mdm';
    }

    get step2Title() {
        return 'Trusted Sources';
    }

    get step2IsOptional() {
        return !this.step2Required;
    }

    get showTrustedSourcesAsOptional() {
        return !this.step2Required;
    }

    get showMatchReconSteps() {
        return this.selectedRoute !== 'mdm';
    }

    get currentStepTitle() {
        const titles = {
            1: 'Step 1: Select Unification Type',
            2: 'Step 2: Trusted Sources',
            3: 'Step 3: Generate Match Rules',
            4: 'Resolution Job Results'
        };
        return titles[this.currentStep] || '';
    }

    get currentStepSubtitle() {
        const subtitles = {
            1: 'What records will this ruleset consolidate?',
            2: 'Map each DMO to its trusted data source.',
            3: 'Choose match rule strategy or create custom rules',
            4: 'Review match quality, consolidation metrics, and rule performance from your latest job run'
        };
        return subtitles[this.currentStep] || '';
    }

    get nextButtonLabel() {
        // Step 4 (Match Rules): Create Ruleset
        if (this.currentStep === 4) {
            return 'Create Ruleset';
        }
        return 'Next';
    }

    get showNextButton() {
        return true; // Always show Next button
    }

    get jobScheduleFrequencyOptions() {
        return [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' }
        ];
    }

    get isAutomaticMode() { return this.jobRunMode === 'automatic'; }
    get isManualMode() { return this.jobRunMode === 'manual'; }

    get automaticCardClass() {
        return this.jobRunMode === 'automatic'
            ? 'visual-picker-card visual-picker-selected slds-p-around_medium'
            : 'visual-picker-card slds-p-around_medium';
    }
    get manualCardClass() {
        return this.jobRunMode === 'manual'
            ? 'visual-picker-card visual-picker-selected slds-p-around_medium'
            : 'visual-picker-card slds-p-around_medium';
    }

    handleSelectAutomatic() { this.jobRunMode = 'automatic'; }
    handleSelectManual() { this.jobRunMode = 'manual'; }

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

    _dloLabel(value) {
        if (!value) return '—';
        const opt = this.dloOptions.find(o => o.value === value);
        return opt ? opt.label : value;
    }

    get individualDloLabel() { return this._dloLabel(this.individualDlo); }
    get contactPointAddressLabel() { return this._dloLabel(this.contactPointAddress); }
    get contactPointAppLabel() { return this._dloLabel(this.contactPointApp); }
    get contactPointEmailLabel() { return this._dloLabel(this.contactPointEmail); }
    get contactPointSocialLabel() { return this._dloLabel(this.contactPointSocial); }
    get contactPointPhoneLabel() { return this._dloLabel(this.contactPointPhone); }
    get partyIdLabel() { return this._dloLabel(this.partyId); }

    // Route selection handlers
    handleRouteSelect(event) {
        const route = event.currentTarget.dataset.route;
        this.selectedRoute = route;
    }

    handleBeginDropdownToggle(event) {
        // Only toggle if the chevron button or its children were clicked
        const chevron = event.currentTarget.querySelector('.plan-begin-chevron');
        if (chevron && (event.target === chevron || chevron.contains(event.target))) {
            event.stopPropagation();
            this.isBeginDropdownOpen = !this.isBeginDropdownOpen;
        }
    }

    handleBeginClick(event) {
        event.stopPropagation();
        this.isBeginDropdownOpen = !this.isBeginDropdownOpen;
    }

    handleRouteDropdownSelect(event) {
        event.stopPropagation();
        const route = event.currentTarget.dataset.route;
        this.selectedRoute = route;
        this.isBeginDropdownOpen = false;
        this.showLandingPage = false;
        this.currentStep = 1;
    }

    // Start configuration from landing page
    handleStartConfiguration() {
        if (!this.selectedRoute) {
            alert('Please select a ruleset creation method');
            return;
        }
        this.showLandingPage = false;
        this.currentStep = 1;
    }

    // Navigate back to landing page
    handleGoToLandingPage() {
        this.showLandingPage = true;
        this.showOperateCertify = false;
        this.currentStep = 1;
        this.selectedRoute = null;
    }

    // Scenario toggle
    get isScenario2() {
        return this.scenario === 2;
    }

    get scenario1BtnClass() {
        return this.scenario === 1 ? 'scenario-fab__pill scenario-fab__pill_active' : 'scenario-fab__pill';
    }

    get scenario2BtnClass() {
        return this.scenario === 2 ? 'scenario-fab__pill scenario-fab__pill_active' : 'scenario-fab__pill';
    }

    handleScenario1() {
        this.scenario = 1;
        this.selectedFix = null;
    }

    handleScenario2() {
        this.scenario = 2;
    }

    // Fix selection
    get isAutoFixSelected() {
        return this.selectedFix === 'auto';
    }

    get isGuidedFixSelected() {
        return this.selectedFix === 'guided';
    }

    get autoFixCardClass() {
        return this.selectedFix === 'auto' ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
    }

    get guidedFixCardClass() {
        return this.selectedFix === 'guided' ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
    }

    get fixButtonLabel() {
        return this.selectedFix === 'auto' ? 'Apply Auto-Fix' : 'Start Guided Review';
    }

    handleFixSelect(event) {
        this.selectedFix = event.currentTarget.dataset.fix;
    }

    handleApplyFix() {
        const msg = this.selectedFix === 'auto'
            ? 'Auto-fix applied — data quality issues resolved.'
            : 'Guided review started — follow the steps to approve each fix.';
        this.showSuccessMessage(msg);
    }

    // Data Quality card — scenario-aware getters
    get dataQualityIcon() {
        return this.scenario === 1 ? 'utility:success' : 'utility:warning';
    }

    get dataQualityIconVariant() {
        return this.scenario === 1 ? 'success' : '';
    }

    get dataQualityCardClass() {
        return this.scenario === 1
            ? 'dq-card dq-card_success slds-m-bottom_large'
            : 'dq-card slds-m-bottom_large';
    }

    get dataQualityTitleClass() {
        return this.scenario === 1
            ? 'dq-section-title dq-section-title_success'
            : 'dq-section-title dq-section-title_warning';
    }

    get dataQualityTitle() {
        return this.scenario === 1 ? 'Data Quality — Excellent' : 'Data Quality — Needs Fixing';
    }

    get dataQualitySubtitle() {
        return this.scenario === 1
            ? 'Your data is ready for Identity Resolution'
            : '3 issues detected that may affect match quality';
    }

    get dataQualityExpandedTitle() {
        return this.scenario === 1 ? 'Why your data is healthy:' : 'Issues requiring attention:';
    }

    get dataQualityMetrics() {
        if (this.scenario === 1) {
            return [
                { id: '1', title: 'Field Completeness', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', value: '98%', valueClass: 'slds-text-heading_medium slds-text-color_success', icon: null },
                { id: '2', title: 'Data Consistency', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', value: '95%', valueClass: 'slds-text-heading_medium slds-text-color_success', icon: null },
                { id: '3', title: 'DMO Mappings', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', value: '100%', valueClass: 'slds-text-heading_medium slds-text-color_success', icon: null },
                { id: '4', title: 'Records Analyzed', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', value: '1.2M', valueClass: 'slds-text-heading_medium', icon: null },
            ];
        }
        return [
            { id: '1', title: 'Field Completeness', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', value: '66%', valueClass: 'slds-text-heading_medium dq-warning-value', icon: 'utility:warning', iconVariant: '' },
            { id: '2', title: 'Data Consistency', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', value: '51%', valueClass: 'slds-text-heading_medium dq-warning-value', icon: 'utility:warning', iconVariant: '' },
            { id: '3', title: 'DMO Mappings', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', value: '73%', valueClass: 'slds-text-heading_medium dq-warning-value', icon: 'utility:warning', iconVariant: '' },
            { id: '4', title: 'Records Analyzed', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', value: '1.2M', valueClass: 'slds-text-heading_medium', icon: null },
        ];
    }

    // Toggle data quality expansion
    handleToggleDataQuality() {
        this.dataQualityExpanded = !this.dataQualityExpanded;
    }

    get dataQualityChevronIcon() {
        return this.dataQualityExpanded ? 'utility:chevrondown' : 'utility:chevronright';
    }

    get selectedRouteLabel() {
        const routeLabels = {
            'unify': 'Create New Ruleset by Unifying Unmatched Records',
            'mdm': 'Create New Ruleset by Importing from MDM',
            'datakit': 'Create New Ruleset by Importing from Data Kits'
        };
        return routeLabels[this.selectedRoute] || '';
    }

    get stepPageHeaderLabel() {
        return this.isEditMode ? 'Identity Resolution' : 'SETUP';
    }

    get stepPageHeaderTitle() {
        return this.isEditMode ? 'Edit Ruleset Details' : this.selectedRouteLabel;
    }

    handleStepClick(event) {
        const step = parseInt(event.currentTarget.dataset.step, 10);
        this.currentStep = step;
    }

    handleSave() {
        if (this.isEditMode) {
            this.isEditMode = false;
            this.showOperateCertify = true;
            this.showLandingPage = false;
        } else {
            this.showOperateCertify = true;
            this.showRulesetList = true;
        }
    }

    handleEditRecord() {
        this.isEditMode = true;
        this.showOperateCertify = false;
        this.showLandingPage = false;
        this.currentStep = 1;
    }

    handleEditCancel() {
        this.isEditMode = false;
        this.showOperateCertify = true;
        this.showLandingPage = false;
    }

    handleCancelStep() {
        this.showLandingPage = true;
        this.currentStep = 1;
        this.selectedRoute = null;
    }

    handleCaseSensitiveChange(event) {
        this.caseSensitive = event.target.checked;
    }

    handleBack() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    handleNext() {
        if (this.currentStep === 4) {
            // Step 4 (Match Rules): create ruleset
            this.showSuccessMessage('Congratulations! Your ruleset has been created successfully.');
        } else if (this.currentStep < 4) {
            this.currentStep++;
        }
    }

    // Show success notification
    showSuccessMessage(message) {
        this.successMessage = message;
        this.showSuccessNotification = true;
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.showSuccessNotification = false;
        }, 5000);
    }

    // Manually close notification
    handleCloseNotification() {
        this.showSuccessNotification = false;
    }

    // Handle Individual DLO selection - auto-populate other fields
    handleIndividualDloChange(event) {
        const selectedValue = event.detail.value;
        this.individualDlo = selectedValue;

        // Only auto-populate fields the user hasn't manually changed
        if (!this._manuallySet.has('contactPointAddress')) this.contactPointAddress = selectedValue;
        if (!this._manuallySet.has('contactPointApp')) this.contactPointApp = selectedValue;
        if (!this._manuallySet.has('contactPointEmail')) this.contactPointEmail = selectedValue;
        if (!this._manuallySet.has('contactPointSocial')) this.contactPointSocial = selectedValue;
        if (!this._manuallySet.has('contactPointPhone')) this.contactPointPhone = selectedValue;
        if (!this._manuallySet.has('partyId')) this.partyId = selectedValue;
    }

    handleContactPointAddressChange(event) {
        this._manuallySet.add('contactPointAddress');
        this.contactPointAddress = event.detail.value;
    }

    handleContactPointAppChange(event) {
        this._manuallySet.add('contactPointApp');
        this.contactPointApp = event.detail.value;
    }

    handleContactPointEmailChange(event) {
        this._manuallySet.add('contactPointEmail');
        this.contactPointEmail = event.detail.value;
    }

    handleContactPointSocialChange(event) {
        this._manuallySet.add('contactPointSocial');
        this.contactPointSocial = event.detail.value;
    }

    handleContactPointPhoneChange(event) {
        this._manuallySet.add('contactPointPhone');
        this.contactPointPhone = event.detail.value;
    }

    handlePartyIdChange(event) {
        this._manuallySet.add('partyId');
        this.partyId = event.detail.value;
    }

    handleGoHome() {
        navigate('/app/ir-intro');
    }

    handleGuidanceToggle() {
        this.guidanceExpanded = !this.guidanceExpanded;
    }

    handleReconDmoToggle(event) {
        const dmo = event.currentTarget.dataset.dmo;
        this.expandedReconDmos = {
            ...this.expandedReconDmos,
            [dmo]: !this.expandedReconDmos[dmo]
        };
    }

    get isIndividualExpanded() { return !!this.expandedReconDmos['individual']; }
    get isCpEmailExpanded() { return !!this.expandedReconDmos['cpEmail']; }
    get isCpPhoneExpanded() { return !!this.expandedReconDmos['cpPhone']; }
    get isCpAddressExpanded() { return !!this.expandedReconDmos['cpAddress']; }

    get individualChevron() { return this.isIndividualExpanded ? 'utility:chevrondown' : 'utility:chevronright'; }
    get cpEmailChevron() { return this.isCpEmailExpanded ? 'utility:chevrondown' : 'utility:chevronright'; }
    get cpPhoneChevron() { return this.isCpPhoneExpanded ? 'utility:chevrondown' : 'utility:chevronright'; }
    get cpAddressChevron() { return this.isCpAddressExpanded ? 'utility:chevrondown' : 'utility:chevronright'; }

    // Resolution tabs
    handleResolutionTabChange(event) {
        this.activeResolutionTab = event.detail.value;
    }

    get trendDurationOptions() {
        return [
            { label: 'Last 7 days', value: '7' },
            { label: 'Last 14 days', value: '14' },
            { label: 'Last 30 days', value: '30' },
            { label: 'Last 90 days', value: '90' },
        ];
    }

    handleTrendDurationChange(event) {
        this.trendDuration = event.detail.value;
    }

    get trendDurationLabel() {
        const opt = this.trendDurationOptions.find(o => o.value === this.trendDuration);
        return opt ? opt.label : 'Last 7 days';
    }

    get isResolutionSummaryTab() {
        return this.activeResolutionTab === 'summary';
    }

    get isProcessingHistoryTab() {
        return this.activeResolutionTab === 'history';
    }

    handleViewMoreJobs() {
        this.showMoreJobs = true;
    }

    get rulesetList() {
        return [
            {
                id: 1,
                name: 'Individual IR — Production',
                entityType: 'Individual',
                status: 'Active',
                statusVariant: 'success',
                profilesMerged: '435K',
                creditsUsed: '12,450',
                matchQuality: '92.5%',
                consolidationRate: '75%',
                sourceRecords: '580K',
                matchRules: '4',
                lastRun: 'Jun 25, 2026',
            },
        ];
    }

    get rulesetHistoryList() {
        const statuses = [
            { isSucceeded: true, isWarning: false, isError: false, statusLabel: 'Succeeded' },
            { isSucceeded: true, isWarning: false, isError: false, statusLabel: 'Succeeded' },
            { isSucceeded: false, isWarning: true, isError: false, statusLabel: '2 Warnings' },
            { isSucceeded: true, isWarning: false, isError: false, statusLabel: 'Succeeded' },
            { isSucceeded: false, isWarning: false, isError: true, statusLabel: '1 error' },
            { isSucceeded: false, isWarning: true, isError: false, statusLabel: 'multiple issues' },
        ];
        const reasons = ['6 job runs', '8 job runs', 'Manual Run', '3 job runs', '2 job runs'];
        const rows = [];
        const baseDate = new Date(2026, 11, 11);
        for (let i = 0; i < 15; i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() - i);
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const year = d.getFullYear();
            const statusObj = statuses[i % statuses.length];
            const src = 40000 + (i * 7123) % 650000;
            const unified = Math.floor(src * 0.75);
            const known = Math.floor(unified * 0.85);
            const filtered = Math.floor(src * 0.08);
            const processed = Math.floor(src * 0.92);
            rows.push({
                id: i,
                dateTime: `${month}/${day}/${year}`,
                duration: `${2 + (i % 6)} job runs`,
                runReason: i === 2 || i === 11 ? 'Manual Run' : reasons[i % reasons.length],
                totalSourceProfiles: src.toLocaleString(),
                totalUnifiedProfiles: unified.toLocaleString(),
                totalKnownRecords: known.toLocaleString(),
                filteredRecords: filtered.toLocaleString(),
                processedRecords: processed.toLocaleString(),
                consolidationRate: `${70 + (i % 20)}%`,
                jobId: `JOB-${String(1000 + i).padStart(6, '0')}`,
                ...statusObj,
            });
        }
        return rows;
    }

    handleLearnMore(event) {
        event.preventDefault();
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
        console.log('Show credit breakdown modal');
    }

    async handlePreviewResults() {
        await PreviewResultsModal.open({ size: 'large', label: 'Sample Merged Profiles' });
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

    get isSkipSelected() {
        return this.selectedStrategy === 'skip';
    }

    get skipRecommendationCardClass() {
        return this.isSkipSelected ? 'visual-picker-card visual-picker-selected' : 'visual-picker-card';
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
