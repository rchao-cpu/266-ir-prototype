import { track } from 'lwc';
import LightningModal from 'lightning/modal';

const MATCH_FIELDS = [
    { id: 'f1', fieldName: 'First Name', apiName: 'FirstName', dmo: 'Individual', dataType: 'Text' },
    { id: 'f2', fieldName: 'Last Name', apiName: 'LastName', dmo: 'Individual', dataType: 'Text' },
    { id: 'f3', fieldName: 'Email Address', apiName: 'EmailAddress', dmo: 'Contact Point Email', dataType: 'Email' },
    { id: 'f4', fieldName: 'Phone Number', apiName: 'PhoneNumber', dmo: 'Contact Point Phone', dataType: 'Phone' },
    { id: 'f5', fieldName: 'Mailing Address', apiName: 'AddressLine1', dmo: 'Contact Point Address', dataType: 'Text' },
    { id: 'f6', fieldName: 'Birth Date', apiName: 'BirthDate', dmo: 'Individual', dataType: 'Date' },
    { id: 'f7', fieldName: 'Social Security Number', apiName: 'SocialSecurityNumber', dmo: 'Individual', dataType: 'Encrypted' },
];

const MATCH_METHOD_OPTIONS = [
    { label: 'Exact', value: 'exact' },
    { label: 'Fuzzy', value: 'fuzzy' },
    { label: 'Normalized', value: 'normalized' },
];

const FAQ_ITEMS = [
    {
        id: 'faq1',
        question: 'What is a match rule?',
        answer: 'A match rule defines the combination of fields and methods used to determine whether two source profiles represent the same individual.',
    },
    {
        id: 'faq2',
        question: 'How do AND vs. OR rules work?',
        answer: 'Multiple criteria within a single rule use AND logic — all fields must match. Multiple rules use OR logic — a match on any one rule triggers a merge.',
    },
    {
        id: 'faq3',
        question: 'What\'s the difference between Exact and Fuzzy matching?',
        answer: 'Exact requires character-for-character equality. Fuzzy allows minor variations (typos, nicknames) using phonetic and edit-distance algorithms.',
    },
    {
        id: 'faq4',
        question: 'How many rules can I add?',
        answer: 'You can add up to 10 custom match rules per ruleset. Each rule can contain up to 5 field criteria.',
    },
];

export default class CustomMatchRulesModal extends LightningModal {
    @track currentScreen = 1;
    @track matchRules = [
        { id: 'r1', criteria: [{ fieldName: 'Email Address', matchMethod: 'exact' }] },
    ];

    get isScreen1() {
        return this.currentScreen === 1;
    }

    get isScreen2() {
        return this.currentScreen === 2;
    }

    get matchFieldRows() {
        return MATCH_FIELDS.map(f => ({ ...f }));
    }

    get faqItems() {
        return FAQ_ITEMS;
    }

    get matchMethodOptions() {
        return MATCH_METHOD_OPTIONS;
    }

    get formattedRules() {
        return this.matchRules.map((rule, ruleIndex) => ({
            ...rule,
            ruleNumber: ruleIndex + 1,
            criteriaLabel: rule.criteria.map(c => `${c.fieldName} (${c.matchMethod})`).join(' + '),
        }));
    }

    handleNext() {
        this.currentScreen = 2;
    }

    handleBack() {
        this.currentScreen = 1;
    }

    handleCancel() {
        this.close();
    }

    handleSave() {
        this.close('saved');
    }

    handleAddRule() {
        const newId = 'r' + (this.matchRules.length + 1);
        this.matchRules = [...this.matchRules, { id: newId, criteria: [{ fieldName: 'First Name', matchMethod: 'exact' }] }];
    }

    handleDeleteRule(event) {
        const ruleId = event.currentTarget.dataset.ruleId;
        this.matchRules = this.matchRules.filter(r => r.id !== ruleId);
    }
}
