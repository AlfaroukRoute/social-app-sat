// ===============================
// lib/buildPrescriptionBundle.js
// ===============================

import { generateUUID, getMaritalStatusDisplay, getEncounterClassCode, getEncounterClassDisplay, getFormDisplay } from './bundleHelpers.js';
import { MEDICATION_LOGGER } from '../config/logger.js';

/**
 * @typedef {Object} BundleResource
 * @property {string} resourceType - FHIR resource type
 * @property {string} id - Resource UUID
 * @property {Object} meta - Resource metadata
 * @property {Array<string>} meta.profile - FHIR profiles
 */

/**
 * @typedef {Object} MessageHeaderResource
 * @property {string} resourceType - "MessageHeader"
 * @property {string} id - Resource UUID
 * @property {Object} meta - Resource metadata
 * @property {Object} eventCoding - Event coding
 * @property {Object} sender - Sender information
 * @property {Object} author - Author information
 * @property {Object} focus - Focus reference
 */

/**
 * @typedef {Object} PatientResource
 * @property {string} resourceType - "Patient"
 * @property {string} id - Resource UUID
 * @property {Object} meta - Resource metadata
 * @property {Array<Object>} identifier - Patient identifiers
 * @property {Array<Object>} name - Patient names
 * @property {string} gender - Patient gender
 * @property {string} birthDate - Patient birth date
 * @property {Array<Object>} address - Patient addresses
 * @property {Array<Object>} telecom - Patient telecom
 * @property {Object} maritalStatus - Marital status
 * @property {Array<Object>} extension - Extensions
 */

/**
 * @typedef {Object} PractitionerResource
 * @property {string} resourceType - "Practitioner"
 * @property {string} id - Resource UUID
 * @property {Object} meta - Resource metadata
 * @property {Array<Object>} identifier - Practitioner identifiers
 * @property {Object} name - Practitioner name
 * @property {Array<Object>} address - Practitioner addresses
 * @property {Array<Object>} telecom - Practitioner telecom
 */

/**
 * @typedef {Object} PractitionerRoleResource
 * @property {string} resourceType - "PractitionerRole"
 * @property {string} id - Resource UUID
 * @property {Object} meta - Resource metadata
 * @property {Object} practitioner - Practitioner reference
 * @property {Object} organization - Organization reference
 * @property {Object} code - Role code
 * @property {Object} specialty - Specialty
 */

/**
 * @typedef {Object} OrganizationResource
 * @property {string} resourceType - "Organization"
 * @property {string} id - Resource UUID
 * @property {Object} meta - Resource metadata
 * @property {Array<Object>} identifier - Organization identifiers
 * @property {string} name - Organization name
 */

/**
 * @typedef {Object} EncounterResource
 * @property {string} resourceType - "Encounter"
 * @property {string} id - Resource UUID
 * @property {Object} meta - Resource metadata
 * @property {Array<Object>} identifier - Encounter identifiers
 * @property {Object} class - Encounter class
 * @property {Object} period - Encounter period
 * @property {Object} serviceProvider - Service provider
 */

/**
 * @typedef {Object} ObservationResource
 * @property {string} resourceType - "Observation"
 * @property {string} id - Resource UUID
 * @property {Object} meta - Resource metadata
 * @property {string} status - Observation status
 * @property {Object} code - Observation code
 * @property {(string|Object)} value - Observation value
 */

/**
 * @typedef {Object} MedicationResource
 * @property {string} resourceType - "Medication"
 * @property {string} id - "medicationprescribed"
 * @property {Object} meta - Resource metadata
 * @property {Object} code - Medication code
 * @property {Object} form - Medication form
 */

/**
 * @typedef {Object} MedicationRequestResource
 * @property {string} resourceType - "MedicationRequest"
 * @property {string} id - Resource UUID
 * @property {Object} meta - Resource metadata
 * @property {Array<Object>} contained - Contained resources
 * @property {Array<Object>} identifier - Request identifiers
 * @property {string} status - Request status
 * @property {string} intent - Request intent
 * @property {Array<Object>} groupIdentifier - Group identifier
 * @property {string} authoredOn - Authored date
 * @property {Object} category - Request category
 * @property {Object} subject - Subject reference
 * @property {Object} requester - Requester reference
 * @property {Object} encounter - Encounter reference
 * @property {Object} medicationReference - Medication reference
 * @property {Array<Object>} dosageInstruction - Dosage instructions
 * @property {Array<Object>} note - Notes
 * @property {Object} dispenseRequest - Dispense request
 * @property {Object} reasonCode - Reason code
 * @property {Array<Object>} supportingInformation - Supporting info references
 */

/**
 * @typedef {Object} BundleEntry
 * @property {Object} resource - FHIR resource
 */

/**
 * @typedef {Object} PrescriptionBundle
 * @property {string} resourceType - "Bundle"
 * @property {string} id - Bundle UUID
 * @property {Object} meta - Bundle metadata
 * @property {string} type - Bundle type (always "message")
 * @property {string} timestamp - Bundle timestamp
 * @property {Array<BundleEntry>} entry - Bundle entries
 */

/**
 * Creates a MessageHeader resource for the bundle
 * @param {string} messageHeaderId - UUID for MessageHeader
 * @param {string} policyNphiesLic - Policy NPHIES license
 * @param {Array} practitioners - Array of practitioners
 * @param {Object} prescriptionRequest - Prescription request data
 * @returns {MessageHeaderResource} MessageHeader resource
 */
export function createMessageHeader( messageHeaderId, policyNphiesLic, practitioners, prescriptionRequest) {
    return {
        resourceType: "MessageHeader",
        id: messageHeaderId,
        meta: {
            profile: [
                "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/messageheader|1.0"
            ]
        },
        eventCoding: {
            system: "http://nphies.sa/fhir/ksa/nphies-cs/terminology/CodeSystem/EventCoding",
            code: "submit"
        },
        sender: {
            identifier: [
                {
                    system: "2.16.840.1.113883.3.3731.1.2.2",
                    value: policyNphiesLic || "11000000002333"
                }
            ]
        },
        author: {
            identifier: [
                {
                    system: "2.16.840.1.113883.3.3731.1.2.1",
                    value: practitioners[0]?.practitioner_license || "05RM14422"
                }
            ]
        },
        focus: {
            identifier: [
                {
                    system: `2.16.840.1.113883.3.3731.1.2.2.100.1.1.${policyNphiesLic || "11000000002333"}.100.100.2`,
                    value: prescriptionRequest?.req_no?.toString() || "1_pre_s1_pi1"
                }
            ]
        }
    };
}

/**
 * Creates a Patient resource for the bundle
 * @param {Object} data - The data object
 * @param {string} patientId - UUID for Patient
 * @param {Object} patient - Patient data
 * @returns {PatientResource} Patient resource
 */
export function createPatient(data, patientId, patient) {
    return {
        resourceType: "Patient",
        id: patientId,
        meta: {
            profile: [
                "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/patient|1.0"
            ]
        },
        identifier: [
            {
                system: "2.16.840.1.113883.3.3731.1.1.100.1",
                value: patient?.IDENTIFIER_VALUE || patient?.identifier_value || "30000000007741"
            }
        ],
        name: [
            {
                text: `${patient?.PAT_NAME_1 || patient?.first_name || ''} ${patient?.PAT_NAME_2 || patient?.middle_names || ''} ${patient?.PAT_NAME_FAMILY || patient?.last_name || ''}`.trim(),
                family: patient?.PAT_NAME_FAMILY || patient?.last_name || '',
                given: [
                    patient?.PAT_NAME_1 || patient?.first_name || '',
                    patient?.PAT_NAME_2 || patient?.middle_names || ''
                ].filter(Boolean)
            }
        ],
        gender: patient?.GENDER || patient?.gender || 'male',
        birthDate: patient?.DATE_OF_BIRTH || patient?.birth_date ? 
            new Date(patient?.DATE_OF_BIRTH || patient?.birth_date).toISOString().split('T')[0] : 
            '1976-12-30',
        address: [
            {
                text: "1234 Guardian St, Riyadh 12629, Saudi Arabia",
                line: "1234 Guardian St",
                city: "Riyadh",
                postalCode: "13337",
                country: "Saudi Arabia"
            }
        ],
        telecom: [
            {
                system: "phone",
                value: patient?.MOBILE_NO || patient?.phone || "+9741432345678",
                rank: 1
            }
        ],
        maritalStatus: {
            coding: [
                {
                    system: "2.16.840.1.113883.5.2",
                    code: patient?.MARITAL_CODE || patient?.marital_status || "S",
                    display: getMaritalStatusDisplay(patient?.MARITAL_CODE || patient?.marital_status)
                }
            ]
        },
        extension: [
            {
                valueCodeableConcept: {
                    coding: [
                        {
                            system: "2.16.840.1.113883.3.3731.1.202.10",
                            code: "1",
                            display: "Islam"
                        }
                    ]
                },
                url: "https://hl7.org/fhir/extensions/StructureDefinition-patient-religion"
            },
            {
                extension: [
                    {
                        url: "code",
                        valueCodeableConcept: {
                            coding: [
                                {
                                    system: "1.0.3166.1",
                                    code: patient?.NATIONALITY_CODE || patient?.nationality || "SAU"
                                }
                            ]
                        }
                    }
                ],
                url: "http://hl7.org/fhir/StructureDefinition/patient-citizenship"
            }
        ]
    };
}

/**
 * Creates a Practitioner resource for the bundle
 * @param {Object} data - The data object
 * @param {string} practitionerId - UUID for Practitioner
 * @param {Array} practitioners - Array of practitioners
 * @returns {PractitionerResource} Practitioner resource
 */
export function createPractitioner(data, practitionerId, practitioners) {
    const practitioner = practitioners[0] || {};
    const fullName = practitioner.practitioner_name || "Aditya Khan";
    const nameParts = fullName.split(' ');
    
    return {
        resourceType: "Practitioner",
        id: practitionerId,
        meta: {
            profile: [
                "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/practitioner|1.0"
            ]
        },
        identifier: [
            {
                system: "2.16.840.1.113883.3.3731.1.2.1",
                value: practitioner.practitioner_license || "05RM14422"
            }
        ],
        name: {
            given: nameParts[0] || "Aditya",
            family: nameParts.slice(1).join(' ') || "Khan"
        },
        address: [
            {
                text: "3920 Mathar Alshibani St, Riyadh 12629, Saudi Arabia",
                line: "3920 Mathar Alshibani St",
                city: "Riyadh",
                postalCode: "12629",
                country: "Saudi Arabia"
            }
        ],
        telecom: [
            {
                system: "phone",
                value: "+97414347444",
                rank: 1
            },
            {
                system: "email",
                value: "office@intmedcentre.sa"
            }
        ]
    };
}

/**
 * Creates a PractitionerRole resource for the bundle
 * @param {Object} data - The data object
 * @param {string} practitionerRoleId - UUID for PractitionerRole
 * @param {string} practitionerId - UUID for Practitioner
 * @param {string} organizationId - UUID for Organization
 * @param {Array} practitioners - Array of practitioners
 * @param {string} policyNphiesLic - Policy NPHIES license
 * @returns {PractitionerRoleResource} PractitionerRole resource
 */
export function createPractitionerRole(data, practitionerRoleId, practitionerId, organizationId, practitioners, policyNphiesLic) {
    const practitioner = practitioners[0] || {};
    
    return {
        resourceType: "PractitionerRole",
        id: practitionerRoleId,
        meta: {
            profile: [
                "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/practitionerrole|1.0"
            ]
        },
        practitioner: {
            reference: `Practitioner/${practitionerId}`,
            identifier: [
                {
                    system: "2.16.840.1.113883.3.3731.1.2.1",
                    value: practitioner.practitioner_license || "05RM14422"
                }
            ]
        },
        organization: {
            reference: `Organization/${organizationId}`,
            identifier: [
                {
                    system: "2.16.840.1.113883.3.3731.1.2.2",
                    value: policyNphiesLic || "11000000002333"
                }
            ]
        },
        code: {
            coding: [
                {
                    system: "2.16.840.1.113883.3.3731.1.202.1",
                    code: "100000003",
                    display: "Medicine and Surgery"
                }
            ]
        },
        specialty: {
            coding: [
                {
                    system: "2.16.840.1.113883.3.3731.1.202.5",
                    code: practitioner.careteam_qualification || "CE9D7C6B-62F9-E811-B80F-005056AD2FD8",
                    display: practitioner.careteam_qualification_display || "Laboratory - Microbiology"
                }
            ]
        }
    };
}

/**
 * Creates an Organization resource for the bundle
 * @param {Object} data - The data object
 * @param {string} organizationId - UUID for Organization
 * @param {string} policyNphiesLic - Policy NPHIES license
 * @param {Object} insuranceInfo - Insurance information
 * @returns {OrganizationResource} Organization resource
 */
export function createOrganization(data, organizationId, policyNphiesLic, insuranceInfo) {
    return {
        resourceType: "Organization",
        id: organizationId,
        meta: {
            profile: [
                "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/organization|1.0"
            ]
        },
        identifier: [
            {
                system: "2.16.840.1.113883.3.3731.1.2.2",
                value: policyNphiesLic || "11000000002333"
            }
        ],
        name: insuranceInfo?.PURCHASER_NAME || insuranceInfo?.purchaser_name || "International University Hospital"
    };
}

/**
 * Creates an Encounter resource for the bundle
 * @param {Object} data - The data object
 * @param {string} encounterId - UUID for Encounter
 * @param {Object} encounterType - Encounter type data
 * @param {Object} prescriptionRequest - Prescription request data
 * @param {Object} insuranceInfo - Insurance information
 * @param {string} policyNphiesLic - Policy NPHIES license
 * @returns {EncounterResource} Encounter resource
 */
export function createEncounter(data, encounterId, encounterType, prescriptionRequest, insuranceInfo, policyNphiesLic) {
    return {
        resourceType: "Encounter",
        id: encounterId,
        meta: {
            profile: [
                "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/encounter|1.0"
            ]
        },
        identifier: [
            {
                system: `2.16.840.1.113883.3.3731.1.2.2.100.1.1.${policyNphiesLic || "11000000002333"}.300.1`,
                value: prescriptionRequest?.episode_no?.toString() || "12345678"
            }
        ],
        class: {
            coding: [
                {
                    system: "urn:oid:2.16.840.1.113883.18.5",
                    code: getEncounterClassCode(encounterType?.ENCOUNTER_TYPE || encounterType?.encounter_type),
                    display: getEncounterClassDisplay(encounterType?.ENCOUNTER_TYPE || encounterType?.encounter_type)
                }
            ]
        },
        period: {
            start: prescriptionRequest?.req_creation_date ? 
                new Date(prescriptionRequest.req_creation_date).toISOString().replace('Z', '+03:00') : 
                "2023-07-07T12:30:00+03:00"
        },
        serviceProvider: {
            display: insuranceInfo?.PURCHASER_NAME || insuranceInfo?.purchaser_name || "International University Hospital"
        }
    };
}

/**
 * Creates symptom observations
 * @param {Object} data - The data object
 * @param {Array} observationIds - Array of observation UUIDs
 * @param {number} startIndex - Starting index in observationIds array
 * @param {Array} symptoms - Array of symptoms
 * @returns {Object} Object with observations array and new index
 */
export function createSymptomObservations(data, observationIds, startIndex, symptoms) {
    const observations = [];
    let index = startIndex;

    if (symptoms && symptoms.length > 0) {
        symptoms.forEach(symptom => {
            observations.push({
                resourceType: "Observation",
                id: observationIds[index++],
                meta: {
                    profile: [
                        "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/additionalorderinformation|1.0"
                    ]
                },
                status: "registered",
                code: {
                    coding: [
                        {
                            system: "urn:oid:2.16.840.1.113883.6.96",
                            code: "102478008",
                            display: "Preexisting condition"
                        }
                    ]
                },
                valueString: symptom.DIAGNOSIS_NOTE || symptom.diagnosis_note || ""
            });
        });
    }

    return { observations, newIndex: index };
}

/**
 * Creates chief complaint observations
 * @param {Object} data - The data object
 * @param {Array} observationIds - Array of observation UUIDs
 * @param {number} startIndex - Starting index in observationIds array
 * @param {Array} chiefComplaints - Array of chief complaints
 * @returns {Object} Object with observations array and new index
 */
export function createChiefComplaintObservations(data, observationIds, startIndex, chiefComplaints) {
    const observations = [];
    let index = startIndex;

    if (chiefComplaints && chiefComplaints.length > 0) {
        chiefComplaints.forEach(complaint => {
            observations.push({
                resourceType: "Observation",
                id: observationIds[index++],
                meta: {
                    profile: [
                        "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/additionalorderinformation|1.0"
                    ]
                },
                status: "registered",
                code: {
                    coding: [
                        {
                            system: "urn:oid:2.16.840.1.113883.6.96",
                            code: "422843007",
                            display: "Chief complaint"
                        }
                    ]
                },
                valueString: complaint.DESCRIPTION || complaint.description || ""
            });
        });
    }

    return { observations, newIndex: index };
}

/**
 * Creates vital sign observations
 * @param {Object} data - The data object
 * @param {Array} observationIds - Array of observation UUIDs
 * @param {number} startIndex - Starting index in observationIds array
 * @param {Object} vitalSigns - Vital signs data
 * @returns {Object} Object with observations array and new index
 */
export function createVitalSignObservations(data, observationIds, startIndex, vitalSigns) {
    const observations = [];
    let index = startIndex;

    if (vitalSigns && Object.keys(vitalSigns).length > 0) {
        if (vitalSigns.TEMPERATURE || vitalSigns.temperature) {
            observations.push({
                resourceType: "Observation",
                id: observationIds[index++],
                meta: {
                    profile: [
                        "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/additionalorderinformation|1.0"
                    ]
                },
                status: "registered",
                code: {
                    coding: [
                        {
                            system: "urn:oid:2.16.840.1.113883.6.96",
                            code: "386725007",
                            display: "Body temperature"
                        }
                    ]
                },
                valueQuantity: {
                    value: parseFloat(vitalSigns.TEMPERATURE || vitalSigns.temperature),
                    unit: "°C"
                }
            });
        }

        if (vitalSigns.WEIGHT || vitalSigns.weight) {
            observations.push({
                resourceType: "Observation",
                id: observationIds[index++],
                meta: {
                    profile: [
                        "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/additionalorderinformation|1.0"
                    ]
                },
                status: "registered",
                code: {
                    coding: [
                        {
                            system: "urn:oid:2.16.840.1.113883.6.96",
                            code: "363808001",
                            display: "Body Weight Measure"
                        }
                    ]
                },
                valueQuantity: {
                    value: parseFloat(vitalSigns.WEIGHT || vitalSigns.weight),
                    unit: "kg"
                }
            });
        }

        if (vitalSigns.HEIGHT || vitalSigns.height) {
            observations.push({
                resourceType: "Observation",
                id: observationIds[index++],
                meta: {
                    profile: [
                        "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/additionalorderinformation|1.0"
                    ]
                },
                status: "registered",
                code: {
                    coding: [
                        {
                            system: "urn:oid:2.16.840.1.113883.6.96",
                            code: "363809003",
                            display: "Body height measure"
                        }
                    ]
                },
                valueQuantity: {
                    value: parseFloat(vitalSigns.HEIGHT || vitalSigns.height),
                    unit: "cm"
                }
            });
        }

        if (vitalSigns.PULSE_RATE || vitalSigns.pulse_rate) {
            observations.push({
                resourceType: "Observation",
                id: observationIds[index++],
                meta: {
                    profile: [
                        "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/additionalorderinformation|1.0"
                    ]
                },
                status: "registered",
                code: {
                    coding: [
                        {
                            system: "urn:oid:2.16.840.1.113883.6.96",
                            code: "8867-4",
                            display: "Heart rate"
                        }
                    ]
                },
                valueQuantity: {
                    value: parseFloat(vitalSigns.PULSE_RATE || vitalSigns.pulse_rate),
                    unit: "/min"
                }
            });
        }

        if (vitalSigns.OXYGEN_SATURATION || vitalSigns.oxygen_saturation) {
            observations.push({
                resourceType: "Observation",
                id: observationIds[index++],
                meta: {
                    profile: [
                        "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/additionalorderinformation|1.0"
                    ]
                },
                status: "registered",
                code: {
                    coding: [
                        {
                            system: "urn:oid:2.16.840.1.113883.6.96",
                            code: "59408-5",
                            display: "Oxygen saturation"
                        }
                    ]
                },
                valueQuantity: {
                    value: parseFloat(vitalSigns.OXYGEN_SATURATION || vitalSigns.oxygen_saturation),
                    unit: "%"
                }
            });
        }

        if (vitalSigns.HIGH_BLOOD_PRESSURE || vitalSigns.high_blood_pressure) {
            observations.push({
                resourceType: "Observation",
                id: observationIds[index++],
                meta: {
                    profile: [
                        "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/additionalorderinformation|1.0"
                    ]
                },
                status: "registered",
                code: {
                    coding: [
                        {
                            system: "urn:oid:2.16.840.1.113883.6.96",
                            code: "8480-6",
                            display: "Systolic blood pressure"
                        }
                    ]
                },
                valueQuantity: {
                    value: parseFloat(vitalSigns.HIGH_BLOOD_PRESSURE || vitalSigns.high_blood_pressure),
                    unit: "mmHg"
                }
            });
        }

        if (vitalSigns.LOW_BLOOD_PRESSURE || vitalSigns.low_blood_pressure) {
            observations.push({
                resourceType: "Observation",
                id: observationIds[index++],
                meta: {
                    profile: [
                        "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/additionalorderinformation|1.0"
                    ]
                },
                status: "registered",
                code: {
                    coding: [
                        {
                            system: "urn:oid:2.16.840.1.113883.6.96",
                            code: "8462-4",
                            display: "Diastolic blood pressure"
                        }
                    ]
                },
                valueQuantity: {
                    value: parseFloat(vitalSigns.LOW_BLOOD_PRESSURE || vitalSigns.low_blood_pressure),
                    unit: "mmHg"
                }
            });
        }
    }

    return { observations, newIndex: index };
}

/**
 * Creates a contained Medication resource for MedicationRequest
 * @param {Object} line - Prescription line item
 * @returns {MedicationResource} Contained Medication resource
 */
export function createContainedMedication(line) {
    return {
        resourceType: "Medication",
        id: "medicationprescribed",
        meta: {
            profile: [
                "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/medicationprescribed|1.0"
            ]
        },
        code: {
            coding: [
                {
                    system: "2.16.840.1.113883.3.3731.1.205.1",
                    code: line.SCIENTIFIC_CODE || line.scientific_code || "800402-0130-5406",
                    display: line.DESCRIPTION || line.description || "cromoglicic acid and tetryzoline 40 and 0.5 mg/ml solution/ drops"
                }
            ],
            text: line.DESCRIPTION || line.description || "cromoglicic acid and tetryzoline 40 and 0.5 mg/ml solution/ drops"
        },
        form: {
            coding: [
                {
                    system: "2.16.840.1.113883.3.3731.1.205.8",
                    code: line.PRODUCT_CATEGORY_CODE || line.product_category_code || "5406",
                    display: getFormDisplay(line.PRODUCT_CATEGORY_CODE || line.product_category_code) || "solution/ drops"
                }
            ]
        }
    };
}

/**
 * Creates a MedicationRequest resource
 * @param {Object} data - The data object
 * @param {string} medicationRequestId - UUID for MedicationRequest
 * @param {number} index - Line item index
 * @param {Object} line - Prescription line item
 * @param {Object} dosage - Dosage information
 * @param {Object} diagnosis - Diagnosis information
 * @param {Array} observationIds - Array of observation UUIDs
 * @param {number} observationCount - Number of observations created
 * @param {string} patientId - UUID for Patient
 * @param {string} practitionerRoleId - UUID for PractitionerRole
 * @param {string} encounterId - UUID for Encounter
 * @param {Object} prescriptionRequest - Prescription request data
 * @param {Object} patient - Patient data
 * @param {string} policyNphiesLic - Policy NPHIES license
 * @returns {MedicationRequestResource} MedicationRequest resource
 */
export function createMedicationRequest(
    data, medicationRequestId, index, line, dosage, diagnosis,
    observationIds, observationCount, patientId, practitionerRoleId,
    encounterId, prescriptionRequest, patient, policyNphiesLic
) {
    const supportingInfoRefs = [];
    for (let i = 0; i < observationCount; i++) {
        supportingInfoRefs.push({
            reference: `Observation/${observationIds[i]}`
        });
    }

    // Calculate repeat end if not provided
    let repeatEnd = dosage?.REPEAT_END || dosage?.repeat_end;
    if (!repeatEnd && (dosage?.REPEAT_START || dosage?.repeat_start) && (dosage?.DOSAGE_PERIOD || dosage?.dosage_period)) {
        const startDate = new Date(dosage.REPEAT_START || dosage.repeat_start);
        const days = dosage.DOSAGE_PERIOD || dosage.dosage_period;
        repeatEnd = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
    }

    return {
        resourceType: "MedicationRequest",
        id: medicationRequestId,
        meta: {
            profile: [
                "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/medicationrequest|1.0"
            ]
        },
        contained: [createContainedMedication(line)],
        identifier: [
            {
                system: `2.16.840.1.113883.3.3731.1.2.2.100.1.1.${policyNphiesLic || "11000000002333"}.100.100.2`,
                value: `${prescriptionRequest?.req_no}_${index + 1}` || `1_pre_s1_pi${index + 1}`
            }
        ],
        status: "active",
        intent: "order",
        groupIdentifier: [
            {
                system: `2.16.840.1.113883.3.3731.1.2.2.100.1.1.${policyNphiesLic || "11000000002333"}.100.100`,
                value: prescriptionRequest?.req_no?.toString() || "Prescription123456789"
            }
        ],
        authoredOn: prescriptionRequest?.req_creation_date ? 
            new Date(prescriptionRequest.req_creation_date).toISOString().replace('Z', '+03:00') : 
            "2021-06-02T08:00:00+03:00",
        category: {
            coding: [
                {
                    system: "2.16.840.1.113883.3.3731.1.205.14",
                    code: (line.DRUG_DISPENSING_TYPE || line.drug_dispensing_type) === 'B' ? "B" : "U",
                    display: (line.DRUG_DISPENSING_TYPE || line.drug_dispensing_type) === 'B' ? "Brand required" : "Uncontrolled"
                },
                {
                    system: "2.16.840.1.113883.3.3731.1.205.23",
                    code: prescriptionRequest?.attendance_type === 'I' ? "inpatient" : "outpatient",
                    display: prescriptionRequest?.attendance_type === 'I' ? "Inpatient" : "Outpatient"
                }
            ]
        },
        subject: {
            reference: `Patient/${patientId}`,
            identifier: [
                {
                    system: "2.16.840.1.113883.3.3731.1.1.100.1",
                    value: patient?.IDENTIFIER_VALUE || patient?.identifier_value || "30000000007741"
                }
            ]
        },
        requester: {
            reference: `PractitionerRole/${practitionerRoleId}`
        },
        encounter: {
            reference: `Encounter/${encounterId}`,
            identifier: [
                {
                    system: `2.16.840.1.113883.3.3731.1.2.2.100.1.1.${policyNphiesLic || "11000000002333"}.300.1`,
                    value: prescriptionRequest?.episode_no?.toString() || "12345678"
                }
            ]
        },
        medicationReference: {
            reference: "#medicationprescribed"
        },
        dosageInstruction: [
            {
                text: dosage?.PER_DESCRIPTION || dosage?.per_description || "Narrative dosage instructions: 3 times per day for 3 months",
                patientInstruction: dosage?.patient_instruction || "apply carefully",
                timing: {
                    repeat: {
                        boundsPeriod: {
                            start: dosage?.REPEAT_START || dosage?.repeat_start ? 
                                new Date(dosage.REPEAT_START || dosage.repeat_start).toISOString().split('T')[0] : 
                                "2021-06-02",
                            end: repeatEnd ? 
                                new Date(repeatEnd).toISOString().split('T')[0] : 
                                "2021-09-02"
                        }
                    }
                },
                route: {
                    coding: [
                        {
                            system: "2.16.840.1.113883.6.96",
                            code: dosage?.ROUTE_CODE || dosage?.route_code || "372468001",
                            display: dosage?.ROUTE_VALUE || dosage?.route_value || "intraocular route"
                        }
                    ]
                },
                doseAndRate: [
                    {
                        doseQuantity: {
                            value: dosage?.UNIT || dosage?.unit || 1,
                            unit: dosage?.UNIT_TYPE || dosage?.unit_type || "mL"
                        }
                    }
                ],
                additionalInstruction: {
                    coding: [
                        {
                            system: "2.16.840.1.113883.6.96",
                            code: "311502001",
                            display: "an hour before food (or on an empty stomach)"
                        }
                    ],
                    text: ""
                },
                asNeededBoolean: (line.URGENT_FLAG || line.urgent_flag) === 'Y'
            }
        ],
        note: [
            {
                text: line.DOSAGE_NARRATIVE || line.dosage_narrative || "Notes from the Prescriber to the Pharmacist"
            }
        ],
        dispenseRequest: {
            validityPeriod: {
                start: prescriptionRequest?.req_creation_date ? 
                    new Date(prescriptionRequest.req_creation_date).toISOString().split('T')[0] : 
                    "2021-06-02",
                end: repeatEnd ? 
                    new Date(repeatEnd).toISOString().split('T')[0] : 
                    "2021-07-02"
            },
            numberOfRepeatsAllowed: line.UNITS_GIVEN || line.units_given || 2,
            quantity: {
                value: line.UNITS_ORDERED || line.units_ordered || 200,
                unit: (line.PRODUCT_CATEGORY_CODE || line.product_category_code) === 'TAB' ? 'tablet' : 'mL'
            },
            expectedSupplyDuration: {
                value: dosage?.DOSAGE_PERIOD || dosage?.dosage_period || 90,
                unit: "day(s)",
                code: "d"
            }
        },
        reasonCode: {
            coding: [
                {
                    system: "urn:oid:2.16.840.1.113883.6.135",
                    code: diagnosis?.DIAG_CODE || diagnosis?.diag_code || "Z35.0",
                    display: diagnosis?.DESCRIPTION || diagnosis?.description || "test"
                }
            ]
        },
        supportingInformation: supportingInfoRefs
    };
}

/**
 * Main function to build the complete FHIR/NPHIES prescription bundle
 * @param {Object} data - The fetched data object containing all required information
 * @returns {PrescriptionBundle} Complete FHIR/NPHIES bundle
 */
export function buildPrescriptionBundle(data) {
    MEDICATION_LOGGER.debug('Building prescription bundle' + JSON.stringify({ 
        reqNo: data?.prescriptionRequest?.req_no 
    }));

    const {
        prescriptionRequest,
        patient,
        prescriptionLines,
        symptoms,
        chiefComplaints,
        diagnoses,
        practitioners,
        encounterType,
        dosages,
        insuranceInfo,
        policyNphiesLic,
        vitalSigns
    } = data;

    // Generate UUIDs for resources
    const bundleId = generateUUID();
    const messageHeaderId = generateUUID();
    const patientId = generateUUID();
    const practitionerId = generateUUID();
    const practitionerRoleId = generateUUID();
    const organizationId = generateUUID();
    const encounterId = generateUUID();
    
    // Calculate total observations needed
    const totalObservations = (symptoms?.length || 0) + 
                              (chiefComplaints?.length || 0) + 
                              (vitalSigns ? 
                                  [
                                      vitalSigns.TEMPERATURE, vitalSigns.WEIGHT, vitalSigns.HEIGHT,
                                      vitalSigns.PULSE_RATE, vitalSigns.OXYGEN_SATURATION,
                                      vitalSigns.HIGH_BLOOD_PRESSURE, vitalSigns.LOW_BLOOD_PRESSURE
                                  ].filter(Boolean).length : 0);
    
    const observationIds = Array(totalObservations).fill().map(() => generateUUID());

    // Get current timestamp in Saudi Arabia timezone
    const timestamp = new Date().toISOString().replace('Z', '+03:00');

    // Build the bundle structure
    /** @type {PrescriptionBundle} */
    const bundle = {
        resourceType: "Bundle",
        id: bundleId,
        meta: {
            profile: [
                "http://nphies.sa/fhir/ksa/nphies-cs/StructureDefinition/bundlePrescription|1.0"
            ]
        },
        type: "message",
        timestamp: timestamp,
        entry: []
    };

    // Add MessageHeader
    bundle.entry.push({
        resource: createMessageHeader(data, messageHeaderId, policyNphiesLic, practitioners, prescriptionRequest)
    });

    // Add Patient
    bundle.entry.push({
        resource: createPatient(data, patientId, patient)
    });

    // Add Practitioner
    bundle.entry.push({
        resource: createPractitioner(data, practitionerId, practitioners)
    });

    // Add PractitionerRole
    bundle.entry.push({
        resource: createPractitionerRole(data, practitionerRoleId, practitionerId, organizationId, practitioners, policyNphiesLic)
    });

    // Add Organization
    bundle.entry.push({
        resource: createOrganization(data, organizationId, policyNphiesLic, insuranceInfo)
    });

    // Add Encounter
    bundle.entry.push({
        resource: createEncounter(data, encounterId, encounterType, prescriptionRequest, insuranceInfo, policyNphiesLic)
    });

    // Add Observations
    let observationIndex = 0;

    // Add symptom observations
    if (symptoms && symptoms.length > 0) {
        const symptomResult = createSymptomObservations(data, observationIds, observationIndex, symptoms);
        symptomResult.observations.forEach(obs => {
            bundle.entry.push({ resource: obs });
        });
        observationIndex = symptomResult.newIndex;
    }

    // Add chief complaint observations
    if (chiefComplaints && chiefComplaints.length > 0) {
        const complaintResult = createChiefComplaintObservations(data, observationIds, observationIndex, chiefComplaints);
        complaintResult.observations.forEach(obs => {
            bundle.entry.push({ resource: obs });
        });
        observationIndex = complaintResult.newIndex;
    }

    // Add vital sign observations
    if (vitalSigns && Object.keys(vitalSigns).length > 0) {
        const vitalResult = createVitalSignObservations(data, observationIds, observationIndex, vitalSigns);
        vitalResult.observations.forEach(obs => {
            bundle.entry.push({ resource: obs });
        });
        observationIndex = vitalResult.newIndex;
    }

    // Add MedicationRequest for each prescription line
    if (prescriptionLines && prescriptionLines.length > 0) {
        prescriptionLines.forEach((line, index) => {
            const dosage = dosages && dosages[index] ? dosages[index] : {};
            const diagnosis = diagnoses && diagnoses[0] ? diagnoses[0] : {};
            const medicationRequestId = generateUUID();

            bundle.entry.push({
                resource: createMedicationRequest(
                    data, medicationRequestId, index, line, dosage, diagnosis,
                    observationIds, observationIndex, patientId, practitionerRoleId,
                    encounterId, prescriptionRequest, patient, policyNphiesLic
                )
            });
        });
    }

    MEDICATION_LOGGER.debug('Prescription bundle built successfully' + JSON.stringify({ 
        bundleId: bundle.id,
        entryCount: bundle.entry.length,
        reqNo: prescriptionRequest?.req_no
    }));

    return bundle;
}