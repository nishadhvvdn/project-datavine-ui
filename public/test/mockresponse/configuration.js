var configurationresponse  = {
	  "webservicehost": "localhost",
	  "webserviceport": "9999",
	  "protocol": "http",
	  "timeout": "3000000",
	  "endpoints": {
		"login": {
		  "name": "login",
		  "method": "post",
		  "data": {
			"email": "?",
			"password": "?"
		  }
		},
		"HSMConfNewConfSave": {
		  "name": "HSMConfNewConfSave",
		  "method": "post",
		  "data": {
			"configName": "?",
			"ClassName": "?",
			"Description": "?"
		  }
		},
		"HSMDownDownloadConfSave": {
		  "name": "HSMDownDownloadConfSave",
		  "method": "post",
		  "data": {
			"configName": "?"
		  }
		},
		"HSMGrpMgmtAssignGrpMembershipCreateAppGrp": {
		  "name": "HSMGrpMgmtAssignGrpMembershipCreateAppGrp",
		  "method": "post",
		  "data": {
			"GroupName": "?",
			"Description": "?"
		  }
		},
		"MMGrpMgmtAssignGrpMembershipCreateAppGrp": {
		  "name": "MMGrpMgmtAssignGrpMembershipCreateAppGrp",
		  "method": "post",
		  "data": {
			"GroupName": "?",
			"Description": "?"
		  }
		},
		"HSMSecurityAssignDeviceSecCodeSave": {
		  "name": "HSMSecurityAssignDeviceSecCodeSave",
		  "method": "post",
		  "data": {
			"updateHSMAssignDeviceSecCodeValues": {
			  "DeviceClassID": "?",
			  "SecurityCodeLevels": "?",
			  "Primary": "?",
			  "Secondary": "?",
			  "Tertiary": "?",
			  "Quarternary": "?"
			}
		  }
		},
		"MMSecurityAssignDeviceSecCodeSave": {
		  "name": "MMSecurityAssignDeviceSecCodeSave",
		  "method": "post",
		  "data": {
			"updateMMAssignDeviceSecCodeValues": {
			  "DeviceClassID": "?",
			  "SecurityCodeLevels": "?",
			  "Primary": "?",
			  "Secondary": "?",
			  "Tertiary": "?",
			  "Quarternary": "?"
			}
		  }
		},
		"HSMSecuritySave": {
		  "name": "HSMSecuritySave",
		  "method": "post",
		  "data": {
			"updateHSMSecuritySaveValues": {
			  "DeviceClassID": "?",
			  "EncryptionType1": "?",
			  "EncryptionKeyID1": "?",
			  "EncryptionKey1": "?",
			  "EncryptionType2": "?",
			  "EncryptionKeyID2": "?",
			  "EncryptionKey2": "?",
			  "EncryptionType3": "?",
			  "EncryptionKeyID3": "?",
			  "EncryptionKey3": "?"
			}
		  }
		},
		"MMSecuritySave": {
		  "name": "MMSecuritySave",
		  "method": "post",
		  "data": {
			"updateMMSecuritySaveValues": {
			  "DeviceClassID": "?",
			  "EncryptionType1": "?",
			  "EncryptionKeyID1": "?",
			  "EncryptionKey1": "?",
			  "EncryptionType2": "?",
			  "EncryptionKeyID2": "?",
			  "EncryptionKey2": "?",
			  "EncryptionType3": "?",
			  "EncryptionKeyID3": "?",
			  "EncryptionKey3": "?"
			}
		  }
		},
		"MMConfNewConfSave": {
		  "name": "MMConfNewConfSave",
		  "method": "post",
		  "data": {
			"configName": "?",
			"ClassName": "?",
			"Description": "?"
		  }
		},
		"MMDownDownloadConfSave": {
		  "name": "MMDownDownloadConfSave",
		  "method": "post",
		  "data": {
			"configName": "?"
		  }
		},
		"HSMConfEdit": {
		  "name": "HSMConfEdit",
		  "method": "post",
		  "data": {
			"ConfigID": "?"
		  }
		},
		"HSMConfEditSave": {
		  "name": "HSMConfEditSave",
		  "method": "post",
		  "data": {
			"updatevalues": "?"
		  }
		},
		"MMConfEdit": {
		  "name": "MMConfEdit",
		  "method": "post",
		  "data": {
			"ConfigID": "?"
		  }
		},
		"MMConfEditSave": {
		  "name": "MMConfEditSave",
		  "method": "post",
		  "data": {
			"updatevalues": "?"
		  }
		},
		"HSMTagDiscrepancies": {
		  "name": "HSMTagDiscrepancies",
		  "method": "get"
		},
		"MMTagDiscrepancies": {
		  "name": "MMTagDiscrepancies",
		  "method": "get"
		},
		"HSMJobStatus": {
		  "name": "HSMJobStatus",
		  "method": "get"
		},
		"MMJobStatus": {
		  "name": "MMJobStatus",
		  "method": "get"
		},
		"HSMConf": {
		  "name": "HSMConf",
		  "method": "get"
		},
		"MMConf": {
		  "name": "MMConf",
		  "method": "get"
		},
		"HSMGrpMgmt": {
		  "name": "HSMGrpMgmt",
		  "method": "get"
		},
		"MMGrpMgmt": {
		  "name": "MMGrpMgmt",
		  "method": "get"
		},
		"HSMSecurityCodeMgmt": {
		  "name": "HSMSecurityCodeMgmt",
		  "method": "get"
		},
		"MMSecurityCodeMgmt": {
		  "name": "MMSecurityCodeMgmt",
		  "method": "get"
		},
		"SMNetworkJobStatus": {
		  "name": "SMNetworkJobStatus",
		  "method": "get"
		},
		"SMHyperSprout": {
		  "name": "SMHyperSprout",
		  "method": "get"
		},
		"SMMeters": {
		  "name": "SMMeters",
		  "method": "get"
		},
		"HSMConfImportConfSave": {
		  "name": "HSMConfImportConfSave",
		  "method": "post",
		  "data": {
			"configName": "?",
			"listHS": "?"
		  }
		},
		"MMConfImportConfSave": {
		  "name": "MMConfImportConfSave",
		  "method": "post",
		  "data": {
			"configName": "?",
			"listMeters": "?"
		  }
		},
		"HSMGrpMgmtAssignGrpMembershipAssignEndpoint": {
		  "name": "HSMGrpMgmtAssignGrpMembershipAssignEndpoint",
		  "method": "post",
		  "data": {
			"GroupName": "?",
			"Action": "?",
			"listHS": "?"
		  }
		},
		"MMGrpMgmtAssignGrpMembershipAssignEndpoint": {
		  "name": "MMGrpMgmtAssignGrpMembershipAssignEndpoint",
		  "method": "post",
		  "data": {
			"GroupName": "?",
			"Action": "?",
			"listMeters": "?"
		  }
		},
		"SMEndpointCleanup": {
		  "name": "SMEndpointCleanup",
		  "method": "get"
		},
		"SMNodePing": {
		  "name": "SMNodePing",
		  "method": "post",
		  "data": {
			"SerialNumber": "?"
		  }
		}
	  }
	};