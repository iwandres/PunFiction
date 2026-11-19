/**
 * The 8.3 Billionth — Multi-Scale Architectural & Cartographic Perspective Outlines
 *
 * Provides 81 museum-grade archival blueprint & Natural-Earth cartographic outlines
 * across 27 logarithmic population bands (8.3B down to 1 across all 5 Tiers).
 * Starts on the slowly spinning 3D orthographic Planetary Globe and pairs every
 * outline 1-to-1 with its matched headline & subline.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthScaleOutlines = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  // =========================================================================
  // COMPACT DELTA-ENCODED NATURAL EARTH CARTOGRAPHY & 3D GLOBE DATASET
  // =========================================================================
  const SAFE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  const S64_DEC = new Int8Array(128);
  for (let i = 0; i < 64; i++) S64_DEC[SAFE64.charCodeAt(i)] = i;

  function decodeDelta(str, invScale) {
    const out = [];
    let idx = 0;
    const len = str.length;
    let x = 0;
    let y = 0;
    while (idx < len) {
      let shift = 0;
      let res = 0;
      let b;
      do {
        b = S64_DEC[str.charCodeAt(idx++)];
        res |= (b & 31) << shift;
        shift += 5;
      } while (b >= 32 && idx < len);
      x += res & 1 ? -((res + 1) >> 1) : res >> 1;

      shift = 0;
      res = 0;
      do {
        b = S64_DEC[str.charCodeAt(idx++)];
        res |= (b & 31) << shift;
        shift += 5;
      } while (b >= 32 && idx < len);
      y += res & 1 ? -((res + 1) >> 1) : res >> 1;

      out.push([x * invScale, y * invScale]);
    }
    return out;
  }

  const CARTO_RAW = {"g":["vI3GMBPDVK","mSjFMABHHB","0VjFALNJLC","6VvEQFNPJc","oG1BLtBLACkBSQ","_R3BmBvBLtBNFXEJODDEKHHRO1BNLEDwBcKSWQDMQQDDLSJIa","4QDGJMIYJYZXMHHTECMTGDEGELE","0PGTFEFKEHFGNHMFLCY","4OIEDLTXEDKCKcUKF","6PiBDLNGOM","mPqCAPKHPK","0R0ETNTCDJBIoBSEMGD","gSwFGBVHIQ","_RqGEFFCDNBeEE","byGLBCIME","LqHAJSRZFIQLM","5BqIEFTFXI","7VqIUBLFbCAQ","pL2IMJIMMBEHtBVFLIHoBHKPAOOIHKCOQAaRMKkBhBrBHRLYICLSAVJEIJBNHCFVHBJBIENXPEZNUxBFFXGLSDUMHVWBBRKHSBUQCNGMgBFURWHEPqBLWRPVJjBZLZlBRCGLfPGFPLGJTXPGEWFCMQHBS8CXWTiBAUQUDSLFZa-BUpB0BBFUZJExBgCAeIDBIRIZczBMRHEKfVZFgBSTBPMUObCaCVKqBMwCJiBGsCLMGoBFIGJEGI","nOkJYFGGWN7BBOGbE","5KkJ6BFoBRHHPGOLRAMFtBISOXKlBCFG","xMoJMAEJXE","hP_IVCEKeBIB","mH6IXEQO2BGpBHLH","5L0J6BHxBARI","sN0JcDRHmCBSJkBIyCNmCAGRJBIH-BJFTTPDYiBWRHNEFJzBAbRaJNVpBZGTJBDURBCINHEFOANJMNBNVTnBLOZRTTUDRUdVaFkBLDJcrBbBVJJT2BHBPSjBAlBSQXSKOPRVvBRhBkCDHFKoBpCIDaGAFNZhBhBInBXVCNLHBNXTdAZgCGeRmBCSTM1BFdcBoBsB4B_BGGBBLiBNKKyBHIWhBAFMeKgBATMKKTLNILPGFZBGLFDLUZQBFYPJHbaXFTZbCBYgBELSyBUCOICCNiBCIMKBBIWEdCAKQINCPLEJLPLBJQTDBOuCkBgCLBFbAQJcIBKMHcKaBCGgBHHMYIAbKIHOGGIHUEDGaG","qC_JMBVHVK","7K_JPFVIQG","xIsKaB7BLGDTJjBCSELEMEHEUAlBG","rDuKYDpBBuCBfFKAHDEHLBIHVHMHRBQAlCRNVfOJOMMNBMEREGEPM7BKsBQ"],"m":{"afro_eurasia":{"p":["yElLiBSEQeMWYhBLhBdUaFcOcQHWUOiBBiBUSDKVVHMFJDOIIMFDSSKKSHoBjBiBamBPWbRAWWQIWNFRVNvBLITftBuBAcJOdhCJEVV5BHTRKiBWLQUXc3BSd5CFIDLM8BYoBIGiBFBIRgBrBqBIyBdYGSNKAORUhBE1B5CIhBX9BGZTT3BLPdDxBctBkClBKKyBOJQaeOJcQWEOZhBHAPeFeINVMHXKFLRQCKXDHUL5BFIKaLIHpBVBbSTAFLUdUMMbwBAOPGAJQeIQRQCRJUVVKXcJAIVNBMP0BRUAQUDINDEOSHCJEIeFAFSGBVMeDfGIGDDHQdSACKUNSCFPWVHd","iJgIZGK-BkBXYlBQAMbICfuC","nBlKJAAMjCQfThBAeVgBA4BRWOFK","oJ2BGEJgBbCHVepBME","pB0FN2BNAApBYT","0HyDPDnBrBsBSMO","3EnHTmBTFWNEP","gJ9FCgBFDHOIOJHIZNlB","jB5KFCRXMFIQOA","_L8BRCCNNAOJIOKP","jE1IJGJLMH","oKsBTQEIKJHMKQLLDUBjB","kIjHIBBYPV","kKAASJHDIIX","kH7HWWlBZ","_ItBKWMGTF","AxHLHaVRW","iI0DEAEB","jC7LAAAC"]},"indo_pacific_arc":{"p":["gD1LNUgBGEkBRmBTEVcOiBPGBZLBEDHJRKEPXOIOWBVUSWLAMGLGOCTeEEVUPEFFXULLNGHQWcEWhBeALjBZHeciBIeVLVrBGZFlBDHLMHBAZRjBFONFLQxBeN0BPGPlCGvBRIFNKDJBHXiB3BkCnCyCzB_CbkDF","iFgLPFJbJIKTPSHRTH7CaTFERRnBGABf0BRoBpBaIITQBFHkBGJWkBUS1BIeKEGeQKUkBEaNe","2DiCOUUPyBQaUHEMQQKVBXRRGKEFEbHDThBRFIHJOFLCHL","JKUKROQUHAPkBJEBHfBHhBQACJ","jFS2BoBIWKEBWfVtB-BAF","qElIIOBiBVCFOHJXIsBb","2B2BlBGEMWDPIMSJEHPBWFAFVMb","xCqDoBIQO9BJJF","WxCKCCKFWQCCKdP","2DjLYmBJBKWJA","0E7IMELMPBAKCf","8BJGQDGDFBMLPNGMNCG","2ClGGGFOJP","5IbMWJK","iI4CAILINDSB","zB7CFMJBEJ","oC_DdOOL","WvDFHKL"]},"azimuthal_world":{"p":["qD0LfPIRfTAN7CAXPRZKT0BlB8BHAMkBEGLsBRDRRMRDmBhBTACJFQLBEWRKIMpBTWOFKZRRGRYXDCVYCFTgBRBNIKWJAPIHNEDTBoBFEHNJGBNUnBcBHKMGCPFFICCXMFRJaGXJGHXVELIEBdNBPXZFCZgBDIRSHHUXOWFYOWBFNMJYDaKKPIGNOKMFCKGAPMGOTcMamBSVQSHaMEIXKDLeZICQTOS0BQEEOtBMnB0BhBWYCGTSFEcVsBtCHoBSgBAgBbCaP2BWKVgBKGjBgB","tL_DWDBjBOhBMGCHSSMHDZkB-C4BdhBGWLyBJeQDGwBAaJGJCIGXMJLUSADQOCJGKIJMZIDMTMHaSETKMGJEfXNcNIsBDJYKEPgBjBbOMJGGMTXbLGBLERRTIORBlBDNRDPOKgBRHAcLBFKEaSWJEMEMoBAcOcFM2BqCzBEtBZzBpC","gL9ELGXjBnBnBRFXtBVEHdfnBsDuC","LWDEIIVmBzBKCRUPMf","2IxEBHUIKiBFIfdDN","oH-G-BtC_ByBFEUoB","hCENmBHACHNKCXOGIX","wIkHGeTQFP","iK7CBcRkBIvB","_D7EqBOBGVLZE","F6DKaRG","ZKXADJWB","7BbFKPAIR","iI1FSWHPIGELAOKEPG"]},"subcontinent_cape":{"p":["mFDHCDNAMLCCNFFGGFKZQBaLKXGECfmBrBgBBQXGHQRAFSGqBFDIIR2BEaNCJSOKbCHUPIXVFbjBnCNxBX1BFjCFBEFFNGXFTMHNCCNGAPBFcXKNBhBpBeFILfERTKHNGBHOACJYGgBFHhBLFCPPHCJWVIIaFkCtCAVSJNHPRITHDCPmBG0BZGYOIDWKODQNDIgBIBsBgBNMHYgCiBgBAqBW0BEApBQDAWKKkCFALLLWFOTeVSEOLIEDKGDEGDMYCHSIMVBXUCQJUEILgBRBAwBNIHWEKNnBJNNKJZHEIECcJMDRJUBNAM","5BkKBAAB"],"r":["rCmEIH","gFlCCMMI","gFlCSS","yIpFVe1BWfGHOCc","_ETDH","6EbCU","mEjBFQ","mEjBKEGS","qFzBIU"]},"twin_river_basin":{"p":["yC8HTHCNXJVOhBAAWHABJPEBHLDGLJFANTCGVOJAbNRTAGDHNJGJDpBWdNPOALpBFvBzBNCbdATMCEdHHANVNANPNMBCRLFALWPSIKHOEeJMPEZFDWDKIOhBaIITQJKCAKYUESFY0BWIagCIsBQWLgBDeVHJGLUCqBjBaDRTLITBGhBOEOLIjBHHGLaJWEiBwBkBIMQQDORKKDuBNCHKMYFQHFAKRMEKRAXkBdYHAIDFFITFFfkBPIEIQCGQSPaEBKbQJYQIMYQMZCKBSOTQcCHIGAFGEOLIFWHAGILEICCKZSEEVYlBMHJCOxBSASFAATFBHEJH","iEyILaVABLKJ","8I2GBMNZUfEM"],"r":["-BWBB","5BSBE","Q4DcDiBfOBUCcS","5BSSWoBGZVANIFmBCIHDHSHMTBPQNmBMHeA0B4BJ","tCQME","6EQsBvB","sEmDORaK","0F_CclBSB"]},"continental_shield":{"p":["uElJwCwEoBgBHKYK4BTISdgCrCsCLWDOIKAgBIGAsBJQ1BgBEuBbOFetBsBTI1BILFAXd1BFlBbtBAVUvBPzBIBHAlB1BIJGCFDEjBPJVIFNRJ5BSLHxBIpBdJbPNEHPFCJMAJAHPSbCbFHQdkBnBaNQfWLMRiBKeLoCFMGHeqBOEKeMKFANOHkCUaH","kKwEEiBFBHediCTIHFDbOXBZGNUBQLKX","2J6EAAAA","iKgGBCCB"],"r":["kEHAB","zDvCCH","9FjEBD","oEzGNW","0EILM","uEBEC","4C0FQN","sE_EPA","qEVFM"],"l":["kFyEHHBjB","iFMLSEERECXMF","_D8CNXAX"]},"european_peninsula":{"p":["0GjKLYzBDaQKWQGMFPHAHWCGFLLITaUiCmCwB2CS_BIgCHgD1BNMJEPLFKDENjBaFOAHCOIGMFAGLENSHBAJPAKPVCDDMDNHEKLEJUCQHACaJWYWRGPUGLXBPIIIHBEGTFOWFADIUIEIJDFEIIJAISHDBGHJBGLTIHUAdAFHEDbVCZzBZTfHIDPRGCWekBWEBIkBUAIVJDOKMNUFAGRHR-BpBLbTJjBYZLLGBWjBSRUGQnBefFTKNbfBMXHFIFJCUjBEnBUFqCYGBMjBEKDXJLGFdPBNoBGBTaIBDQFGNcFHDKCDFUZSCGHIGCHMGLNBpBKBAFHGAFWLDUGENYEKMCBISJWQHJGEkBRSGOZDMGAFdGRGDOMGFBTHAFNSLWAAHSFRJtBaPLHlBavBJNNEHKBcXcCgBSQHIEABERKGEFqBLCDONAAVX5BDOFBNSJALJIRLGAFSPROGRFHYBVAALOALFWFEDLCIHIGANMEMHLGDFabFCGPIDFCAHQJHBEFEEFHSLFBKRIFAGEJAMMVGIETIABOMTGOCLOELIIGOHMOQH","lEnENOWGRSGELAUOCQKMAKHDKKDGQGBMNKKGNGlBFHIXBUPMCKHJETLQJAHFAGDQACPFFIHVBKTHAEDJOKZHASf","hI9IKDBDaTCIIDAKCHcGFKEQPIhBE","7FzCKAEOJIHepBEEFHBGDDBUDNBOHJFGFBJQGGPIABEGF","iC2HFcnBRGH","ToGAeNEDjBOF","gG6ImBDVMRD","QpCFUJRGDCEEH","TkFFaHR","yF8GSQZL","vD2GGCFGJF","gBzJJGMR","DlCCIHABF","uCzDFSBJ"],"r":["TkCDA","TkCEC","kC8BWCEoBUIWBGMiBDWNBRKA","d_BuBN","kC8BbBXJ","Z0CIB","RyCCL","TkCAA","duBCPRbPD"]},"cordillera_basin":{"p":["uBuLKEPETNOGIH","qBhBWGdEKB","EvBcORCFJPFPE","4CvGAGOAGOFFDGPB","zFnLBKNAMPHCcJ","bnJGMGNGCEMLCbcBKGKgBKKUEFDLKHHdcEIOILOUcSLMXEPSWNGQMACFEGTODDGFVMCKPEIAPIAOBLEUbYGiBRbxBCPIHeKWYAGLSBLgBeCBYMOMFOGcVASKPKIiBBBEeWgBIGYcGCIYBYMEOXkBR0BjBQLWdeVBEQbIDMJAGITOEOZaNHBPIJFAOVHES3BMjCFNZNbvBIRFJUbBPHLHKPFVbzCfnBvCFIQsBTfGDHbLJFbUxBEIEFJRIrBPbRAMHpBKTDmBFHHGLSHIEGDFFGHIIOPYGMeWASWmBECGIV"],"r":["zBnFAA","6DmGCF","qEyFFG","wEqFDE","sEsCtBOXHhBM","rBvCFFMbHRGHNRCJ","3BlFCB","_CwHEA","6CsHEE"]},"archipelago_basin":{"p":["8C3LCILEICCMdQEEZWdEFILNAQzBOBSFADJEJNAHHfQRiB0BiCKwBHWfQJAAKHFGMLHGKZOGZXJBJFEHVdJCNPCBUPgBCUKAImBUGgBkBAiBOaNClBbT-BVfHAM9BN3BAdFAHPBMJBCGPMAFLCCJHImB1BuBtB2BnB8BbgCRiCF","yBVGDIKBKIDAGWGRGGMREEILCSWFGWSRBFgBPGHMGMLUVKFPLELJTMBLZCFdNPBhBKHcKGXaFSZaFBH","xJASCyB2BGEEDgBcFIUBDQQIIUDIODMOFwBTFAG1BvBVpBTVJZzB1BDN","gGuCTM9BCBOKOQHgBBjBUQSAMKOVGALLJCLFBHEEwBPACbDJJBBLOfGABNIRQFyBGSNEE","zDqGWOeEIJeKIMaCCStEZADVFOP","4DnHUCEYRgBIUIEGHIKEDICDEKKAKZXAMNLTCENFDBIFHFXKCEpB","yGlCKkBFSJRDeBHFEPJCRHFFGNFJQERUNIMSRKAAN","gLgFDLNSDNNHeDEJbEFLPBEJWJcIGiB","zB-HNcJENFANKJ","qH0HhCiBCLaR","0DtJDMLdYdEG","yHwCQNFQKIPAIULJFZMR","2IyEOEEMPHdBDGEL","6E4HdGVDOHeGKH","gF-BNNOTGE","rE_DEOICBIZREH","iG9DKaJBPV","qC0HMAEGnBGGLOGEBHH","0EtDKGTQAZ","qDmIOMHEXJ","0DtEOGDQPT","6BzBmBzBCQ","kH2EGGFGPFCF","4FpDICAW","awHEGJGLL","iFwFAOJGER","hJkCEQLP","uB4HNEKJ","lD2EJEAL","kFnCKfAQ","oF5DGKJHFECJ","oJ_CIGRB","4FtCNAKF","wJsHBFIJ","4E_FFAIL","iG_DGERB","lI_DBABB","B_GBABA"],"r":["tEhDOY","tEhDSW","9FnGYD","lFrGAA","lFrGAA","lFrGMBMOAQQYAqBPM"]},"coast_to_coast_usa":{"p":["0IzEuBPGrBSAIYQMPQDDNWBaSGNIFDCIdUBJGaFQLFEJFIMUHYCNLLCPHIIUNDCHBGSQHCIINDSEMSJNEILCOEDKLBKMNEDQlBiBFUGcayBBcJEflBEFFAARRPXGFJXCCDNGBHAGhBEOEDIKGDENHAIPDJHFEZFNKEBHBDMNIFBCELGDODBIaRDLFFTbnBPBNORLFRVXZDBIpBFxBhBjBDPfZRL7BCDEIBJMCTDDTBbKRCZc3BIEJDILBbUMHMKHFOKNARmFmB4DKiBAAFGKmBMkBH4BaWSKeHcGIsBbDLGDYD","iKzCACAA"],"r":["rHqBCE","rHcAD","rHSOE","tFDPO","hHhGBI","atEEB","d3CIQ","jFtEBD","rBlECmB"],"l":["iFlCIEMNQAMLFMXUNCFD","wH5DFIEIFGhBGIJWFFB","oE7DHQAFHIEmBLOHZEZHCKTEEOJ","qEpEhBENJTMDFNEqBlBQCKMKB","qEpEoBEQOBIJAJJGKHcJPJIEXRHIF"]},"volcanic_archipelago":{"p":["rErCOUWBKJiBCUtBYBKKLCSWFEUSRBDeNGHMEIDOZSFPLEJJTMBLXCFbLHDTCR","lL-DSAwByBGEEDeaFISBDOQIISDIODKMDuBRDBGxBtBnB5BJZxBvBBN","6LEDwDLVTGCLDFGAHDDVRL1BTBNNSDNLHcBEJZCFJPDYRaICaSSqBf","yD5BTM7BABOKMQHeAhBSaqBVGALLJELHBFGCsBNACZDJJBAJSfBLIROFwBIQN","xF6BWOeCGHcIIMYCCQlEVAFTDON","gF3BQLFOKIRAKULLDVKR","iGGMGEMPJbBDEGJ","uCmDxBAOFcGIJ","nGNMQBIZRGF","yD0DCNkBB","CgDMACIlBEGJOGEBHH","wDsDAMTKAL","wKkDPCINMBEE","gByDKOZJ"]},"continental_plains":{"p":["8BqLRINDxCnBHLGLDNjBlBCJXZPlBJFAUsB4CFCTXBRXVIECLNPJrBZVHlBKDNBBLGvBQjBGCFBCZOIFKKHBTJHEJJAHJIDHBGFEECHLIELDJIGBHJEBFORFCGHJKENHCGFFPGFBVFOBLDBBIHVEDVNFXLITFOLKICHVBNGBGbCXDVLwBIQLJBCDFEALJFWNNACNIICTUBMKMHPTIDAJSIDGIIEJAMGjB0BKDGGOoB4BCFaCRIaJESIHDIKAYQEIFGWCKUARKHLCMDOOSDEGDJMCASCPIFFBEHLHGTOSFGMCCOCLGEGSITFLOAMcHKHFIINAAMVDYINSTDSMLIHoBEIIFEWMFmBUUDGYQSKCBJEEALPZOVFPNHELHLDVUDSKKDEMDCKEBIKDAKKPEEBX0BqBUFHYKRGGIFKMNkBpBWLgBLCKABMTcwBhCMGPMQDAIIIeDRUDQJHQTLGAHNYJGJgBMELCRUAFAcHDCHDGKMDSHbDEGOJBAFMUHBMCIMHJEGJCKCJGIGjBmBBOWyBBSFCHHNRANLHPELHnBIKCAMZFfCBKNCLQIQHmBGMDDUkBSG","_BxIGAHXKJKUQLIMCFKABIGFCMCJICDGKDDIKAHISEEDMKKDCWLDAHRKiBQEOXDWOfBPLTKBNMEDDKFHFEPRNFGCHRJCIJAEEhBBDFKBLDARMJBMIQ","pBlJIBCIIFEQCRGAEaOKJGGITHdILVYCVHBFMBLFOLIB","oGqIWBiCQlBOEJzBFAFfQIL","2JjEEaAHMGIJEMGFAMCHGEEMHCHJBSANdSDtB","1B5JIAEKjBSDLOX"],"r":["5D_DCE","5D2DAD","5DuDKE","xCiDJI","1DZBE","zDlBAG","vDtBBG","xC5EUE","uBCCA"],"l":["oEuBECaRRWJC","efDEANPPCFICBH","jBhFLAICXMRFICIDDLMM","4FIDQVG","jCtGBGFBJIGHPAOFPFYADE","0DMHMCYFKDhBFCGN"]},"amazon_shield":{"p":["tH9IaKoBdADLBDTJLkBKCHiBJGLMCBKKMHWGSQKiBPWCAL4BGenBOqBOIAKZYLYNCOCULIUWFFSINQHENQByBWBKGCFQKNAGQHkBMcA0BqBeGEIIiBDUhCyCJBL8ClBwCTQRDZEPOXIXUJAGEH4B1BiCYfLHAOhB4BBLGHJLdVHENRLCelBgBTCPFNJAGbTBHdlBDDrBMbRTAPfAHtBzCfHNAbVEjBalBAAdLKPCFHNAEJVZQVCZoBTOCK7BNTALSDDFJAALkBBKH","6CnIYCJUfIBd","wBxHKPAI"],"r":["gCyCMH","kDmCNA","yDkCJE","A6FEN","oB6DPS","4B8CHO","2E0CBN","8FxBSXWD","e3GfOTHRKNBTQTD3BUnBXRBvBWAKJC"]},"four_island_arc":{"p":["oFjFKBAgBOUIqBPyBNEDKCyBNqBMYPMDQTMARKNJBFYRFPgBETHDTatBAIJPCBNJSMQVIPcJEHBNXALMPZH-BUhBBHWNLhBCETOAiCxBqBCuBJGMWDIHAPYdGfSFPUEOKEqBXUdSLQlBKjBDLJBKRDPOLCRKAESOBEPPEAFEL","_HtJeGWTHcMUQDJK1BUPWFWzBZdMRJFOgBWRATUJ3BURBPaEIDK7BDrBIFiBoB","7GuGUAHQQCCSNUPyBLBAIPKGfJGASRLIHDXUXFDEHLPDOGIJDNIAXKMNTwBd","7C0FMCCUNKHQVNNIVcLHBZPEaPMRKIQDCJOF","iCKDLKLCM","tIsIDACNGA","jC0FLBOL"]},"bi_oceanic_isthmus":{"p":["pKtH0BABGwCkB_BECLmBCiBgBKaaQUVWCsB4BKeuBKN4COaBIJRyByCQCSMyBPWEGDDHQLGrBsBRgBFKMRqBGCHiBFNXctBECOLCaUAIfCJWAS3BpBKIVJCGpBQvCZ3BfjBJxBrBDJKDFFIRNdtBxBGAJDFLEAVLEFLAETXTBPNDVdP5BlBVCuBiBwBUwBCFGGQ_BGGEFSYNOHRfZJtBPTLGddSBEGDHGLflB"],"r":["jC0BCA","P4CRP","jBoCHF","rBiCVN","jC0BDC"]},"mediterranean_boot":{"p":["7IjJmBCgBjBCOaeQrBKMUBGKCbQECVaIMNsBHMcgCMPSMGFOSaHCDNTAJKjBOBOOUNQIkB8BuBY_BcegBW2BANcwD2BgBmBFUPHLVZDLJNETyBiBaEabQDcZiBRADFKpBSJANdnCpBPAPJNVEGHVFRdhBAXPzB5BZHCJXbJBNlCnCjBnBkBZGIZPATPIhBRRYJEJPZ","8EgIZ4BMcJahBHTTNApBZdHJPQZKKUJcOqCNUJ","nFmCIaJQFuCbFFUPCLVIrBFFEZNZCRUGkBbUS","rFhCCwBT0BTPEHLPELFRORaFCV"],"r":["hI5FOCQbKFeM8BBaOOJgBMYHUE"]},"iberian_shield":{"p":["iJ3FEiBJMtBkBzBUPQKGNItBsCIgBWUjBeNmBEKfGPMZqB5DEPObGJUPGVLRdKRJEXd1BQnBJVEKZCjCKCFHVEBNMFOVTWLCFFIjBgBzBKpBA-BFFGLDJKLFACXLCGNNNELOJaBGNcJeQ8BDiCQsBHcKIDcIaF","gHuCJACF","sJDSGRcPDFLJGFFaXOF","oLLVFBHUC","4G_BJCAFQJCE"],"r":["9EEkBE","FjBIL","L5DUIEMLG9BL9BOnBFhBcPHhCB","nC7FKKODqCewCgCeDOOBUKE","9EE1BI","FjBVazBQTJVM","iBpBLLTG","zGM7BKTY"]},"river_delta_fan":{"p":["6KuFRFTdEHHTrD7EdAQ3CLQNqCJQxBtBjBxCLUOSCWwB8BASQYGekC_DgBeLCBIMyBkBatC6B7Bc-BQhCG-BF-BP7BZ1BlBvBrBnB1BnB5CN-BBhCQ-Ca9B4BvCODiCS6CiB8BXILaFRIWBEHWISDMMLHFKSMIFDFUMiCFYROZSjC4BkBwBsBoB2BqB6COgCCkDNgC"],"r":["oCwFCiBPcLINBvB6B","zB6KkBrB","oCwFB3BRbORBLXCJF1BjCFnBW3BArB","H1ElBjC","H1EanC","H1EHnC"]},"twin_island_strait":{"p":["KWkBTFUIPOCLMOHNUAMKGtBmCZQGEJGYOBKVBBFHIJJGMlBUDmBFAGIPkBCMNEbkBLElBAHNNCNLFGZBINJGCHJEAHUHHBGHJBEJMEEFJJKBDFIJEIAJMLEEBHYbcHAHaPSVGCDDSFKRAKU9BUPOrBQNMAHCBGMM","UzKIFeSCIIBMeHCSeDeaICOIABpBOOM2B0BWiBXYKNwBNKFcPJTIHSIINalB8BdUFJLAALJEWlBCb7BvBCJiBTS3BPnBIGIFFHNBLZIIAVPFFLIcdxBKLLKLREJVfOBBG","7F6KBEIIbMIhB"]},"alpine_republic":{"p":["yGpFQMVmCCa6BMEQqBUiBfKEIOH4BGaZBLNRGHcQ4BNCPdvBQRBRnBTBFEBsBnBgCIgBNMdnBGRbHdfFtBHArBoBEaViBfWpBLhCWLFtB9BIZHhB1BDfWGULORKTBAPWNEVJLSpBqBhBIrBiBRuB3BIPPNYVOAUQYHMTUJyBGqBJoBCSLRAHHGLUJaSQAIKwBD"],"r":["sE3FKG","tJ8DMX","3HsC2BI","wCagDhB","wFHSbHlB","6FzCSvB","tJ8DTI","IkCrBgBrBAxCmBf1B"],"l":["hGuCDKZFvBIdiBEVcfkBN","8G7EnBEdRTjB"]},"fjord_island":{"p":["_GtGUFWVSATQLaIKUGCUFWcFGQJSULmBSBSHIMMHOOKAORICWLUVADqBde9Ba1B0BxCaJeHGNFCKdKtDXVVKLBHRMhBZAJVO1CAAnBMOYFYVOZODLDbMKLFBERaPFDdSNPGPPL5BHhBKLTIHmBDMFGGWL8BEIVRIdLuBlBjCZjCYlBVQNaOJLBZeSWJbHFJUDNXCHUKJPKJYQCSYFCaMFAZdXeHLLbBMNgBCgCkCHKOMFYFGNDUYFQOKGYW5BKDOQIpCKLuB4BIxBiBRmBwBIYENN1BaCYcYlBUMYLCNHZSNSC"]}}};

  // Pre-decode & densify 3D Globe rings once for 60fps zero-alloc orthographic rotation
  const GLOBE_RINGS = CARTO_RAW.g.map((enc) => {
    const raw = decodeDelta(enc, 0.5);
    const dense = [];
    const n = raw.length;
    for (let i = 0; i < n; i++) {
      const a = raw[i];
      const b = raw[(i + 1) % n];
      let dlon = b[0] - a[0];
      if (dlon > 180) dlon -= 360;
      else if (dlon < -180) dlon += 360;
      const dlat = b[1] - a[1];
      const steps = Math.max(1, Math.ceil(Math.hypot(dlon, dlat) / 5.5));
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const lonRad = (a[0] + dlon * t) * DEG;
        const latRad = (a[1] + dlat * t) * DEG;
        dense.push([lonRad, Math.sin(latRad), Math.cos(latRad)]);
      }
    }
    return dense;
  });

  const MAP_CACHE = {};
  function getDecodedMap(key) {
    if (MAP_CACHE[key]) return MAP_CACHE[key];
    const src = CARTO_RAW.m[key];
    if (!src) return null;
    const decoded = {
      p: (src.p || []).map((s) => decodeDelta(s, 1 / 210)),
      r: (src.r || []).map((s) => decodeDelta(s, 1 / 190)),
      l: (src.l || []).map((s) => decodeDelta(s, 1 / 190))
    };
    MAP_CACHE[key] = decoded;
    return decoded;
  }

  // =========================================================================
  // ARCHIVAL BLUEPRINT & CARTOGRAPHIC DRAWING ENGINE
  // =========================================================================
  function createBlueprintPen(ctx, cx, cy, S, alpha) {
    const a = Math.max(0, Math.min(1, alpha));
    const px = (x) => cx + x * S;
    const py = (y) => cy + y * S;

    function tracePoly(pts, close) {
      if (!pts || pts.length < 2) return;
      ctx.moveTo(px(pts[0][0]), py(pts[0][1]));
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(px(pts[i][0]), py(pts[i][1]));
      }
      if (close) ctx.closePath();
    }

    function traceSmooth(pts, close) {
      const n = pts ? pts.length : 0;
      if (n < 3) return tracePoly(pts, close);
      if (close) {
        const mx0 = (pts[n - 1][0] + pts[0][0]) * 0.5;
        const my0 = (pts[n - 1][1] + pts[0][1]) * 0.5;
        ctx.moveTo(px(mx0), py(my0));
        for (let i = 0; i < n; i++) {
          const next = pts[(i + 1) % n];
          const mx = (pts[i][0] + next[0]) * 0.5;
          const my = (pts[i][1] + next[1]) * 0.5;
          ctx.quadraticCurveTo(px(pts[i][0]), py(pts[i][1]), px(mx), py(my));
        }
        ctx.closePath();
      } else {
        ctx.moveTo(px(pts[0][0]), py(pts[0][1]));
        for (let i = 1; i < n - 1; i++) {
          const mx = (pts[i][0] + pts[i + 1][0]) * 0.5;
          const my = (pts[i][1] + pts[i + 1][1]) * 0.5;
          ctx.quadraticCurveTo(px(pts[i][0]), py(pts[i][1]), px(mx), py(my));
        }
        ctx.lineTo(px(pts[n - 1][0]), py(pts[n - 1][1]));
      }
    }

    function traceSym(halfPts, smooth) {
      const full = halfPts.slice();
      for (let i = halfPts.length - 1; i >= 0; i--) {
        const pt = halfPts[i];
        if (Math.abs(pt[0]) > 0.001 || (i > 0 && i < halfPts.length - 1)) {
          full.push([-pt[0], pt[1]]);
        }
      }
      if (smooth) traceSmooth(full, true);
      else tracePoly(full, true);
    }

    function traceSuperEllipse(rx, ry, exp, cxOff, cyOff) {
      const ox = cxOff || 0;
      const oy = cyOff || 0;
      const steps = 64;
      const p = 2 / exp;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * TAU;
        const ct = Math.cos(t);
        const st = Math.sin(t);
        const x = ox + Math.sign(ct) * Math.pow(Math.abs(ct), p) * rx;
        const y = oy + Math.sign(st) * Math.pow(Math.abs(st), p) * ry;
        if (i === 0) ctx.moveTo(px(x), py(y));
        else ctx.lineTo(px(x), py(y));
      }
      ctx.closePath();
    }

    function traceRRect(x, y, w, h, r) {
      const hw = w * 0.5;
      const hh = h * 0.5;
      const cr = Math.min(r || 0, hw, hh);
      const x0 = px(x - hw);
      const y0 = py(y - hh);
      const x1 = px(x + hw);
      const y1 = py(y + hh);
      const rc = cr * S;
      ctx.moveTo(x0 + rc, y0);
      ctx.lineTo(x1 - rc, y0);
      ctx.quadraticCurveTo(x1, y0, x1, y0 + rc);
      ctx.lineTo(x1, y1 - rc);
      ctx.quadraticCurveTo(x1, y1, x1 - rc, y1);
      ctx.lineTo(x0 + rc, y1);
      ctx.quadraticCurveTo(x0, y1, x0, y1 - rc);
      ctx.lineTo(x0, y0 + rc);
      ctx.quadraticCurveTo(x0, y0, x0 + rc, y0);
      ctx.closePath();
    }

    const g = {
      S,
      circle(x, y, r) {
        ctx.moveTo(px(x + r), py(y));
        ctx.arc(px(x), py(y), Math.max(0.5, r * S), 0, TAU);
      },
      ellipse(x, y, rx, ry, rot) {
        ctx.save();
        ctx.translate(px(x), py(y));
        if (rot) ctx.rotate(rot);
        ctx.moveTo(rx * S, 0);
        ctx.ellipse(0, 0, Math.max(0.5, rx * S), Math.max(0.5, ry * S), 0, 0, TAU);
        ctx.restore();
      },
      arc(x, y, r, a0, a1) {
        ctx.moveTo(px(x + Math.cos(a0) * r), py(y + Math.sin(a0) * r));
        ctx.arc(px(x), py(y), Math.max(0.5, r * S), a0, a1);
      },
      ellArc(ox, oy, rx, ry, a0, a1, rot) {
        const steps = 28;
        const cr = rot ? Math.cos(rot) : 1;
        const sr = rot ? Math.sin(rot) : 0;
        for (let i = 0; i <= steps; i++) {
          const ang = a0 + ((a1 - a0) * i) / steps;
          const lx = Math.cos(ang) * rx;
          const ly = Math.sin(ang) * ry;
          const x = ox + lx * cr - ly * sr;
          const y = oy + lx * sr + ly * cr;
          if (i === 0) ctx.moveTo(px(x), py(y));
          else ctx.lineTo(px(x), py(y));
        }
      },
      line(x0, y0, x1, y1) {
        ctx.moveTo(px(x0), py(y0));
        ctx.lineTo(px(x1), py(y1));
      },
      quad(x0, y0, cx1, cy1, x1, y1) {
        ctx.moveTo(px(x0), py(y0));
        ctx.quadraticCurveTo(px(cx1), py(cy1), px(x1), py(y1));
      },
      cubic(x0, y0, c1x, c1y, c2x, c2y, x1, y1) {
        ctx.moveTo(px(x0), py(y0));
        const steps = 18;
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const mt = 1 - t;
          const x =
            mt * mt * mt * x0 +
            3 * mt * mt * t * c1x +
            3 * mt * t * t * c2x +
            t * t * t * x1;
          const y =
            mt * mt * mt * y0 +
            3 * mt * mt * t * c1y +
            3 * mt * t * t * c2y +
            t * t * t * y1;
          ctx.lineTo(px(x), py(y));
        }
      },
      poly: tracePoly,
      smooth: traceSmooth,
      sym: traceSym,
      superEllipse: traceSuperEllipse,
      rrect: traceRRect,
      spokes(r0, r1, n, offset, span) {
        g.radialTicks(0, 0, r0, r1, n, offset, span);
      },
      radialTicks(ox, oy, r0, r1, n, offset, span) {
        const total = span || TAU;
        const start = offset || 0;
        for (let i = 0; i < n; i++) {
          const ang = start + (i / (span ? Math.max(1, n - 1) : n)) * total;
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          ctx.moveTo(px(ox + ca * r0), py(oy + sa * r0));
          ctx.lineTo(px(ox + ca * r1), py(oy + sa * r1));
        }
      },
      concentricArcs(ox, oy, r0, rStep, count, a0, a1) {
        for (let i = 0; i < count; i++) {
          const r = r0 + i * rStep;
          g.arc(ox, oy, r, a0, a1);
        }
      },
      scallopRing(ox, oy, rx, ry, lobes, amp, close) {
        const steps = lobes * 10;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * TAU;
          const m = 1 + Math.abs(Math.sin(t * lobes * 0.5)) * amp;
          const x = ox + Math.cos(t) * rx * m;
          const y = oy + Math.sin(t) * ry * m;
          if (i === 0) ctx.moveTo(px(x), py(y));
          else ctx.lineTo(px(x), py(y));
        }
        if (close !== false) ctx.closePath();
      },
      chairs(rx, ry, n, chairW, gap) {
        g.chairRing(0, 0, rx, ry, n, chairW, gap);
      },
      chairRing(ox, oy, rx, ry, n, chairW, gap) {
        for (let i = 0; i < n; i++) {
          const ang = (i / n) * TAU - Math.PI * 0.5;
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          // Outward normal for ellipse
          const nxRaw = ca / Math.max(0.05, rx);
          const nyRaw = sa / Math.max(0.05, ry);
          const nLen = Math.hypot(nxRaw, nyRaw) || 1;
          const nx = nxRaw / nLen;
          const ny = nyRaw / nLen;
          const tx = -ny * chairW;
          const ty = nx * chairW;
          const bx = ox + ca * rx + nx * gap;
          const by = oy + sa * ry + ny * gap;
          // Seat cushion trapezoid + curved outer backrest
          ctx.moveTo(px(bx - tx * 0.85), py(by - ty * 0.85));
          ctx.lineTo(px(bx - tx + nx * chairW * 0.72), py(by - ty + ny * chairW * 0.72));
          ctx.quadraticCurveTo(
            px(bx + nx * chairW * 1.15),
            py(by + ny * chairW * 1.15),
            px(bx + tx + nx * chairW * 0.72),
            py(by + ty + ny * chairW * 0.72)
          );
          ctx.lineTo(px(bx + tx * 0.85), py(by + ty * 0.85));
          ctx.closePath();
        }
      },
      planChair(x, y, w, d, facingAngle) {
        // Draws a crisp top-down chair facing facingAngle (backrest on -facingAngle side)
        const cf = Math.cos(facingAngle);
        const sf = Math.sin(facingAngle);
        const rx = -sf;
        const ry = cf;
        const hw = w * 0.5;
        const hd = d * 0.5;
        const p1 = [x + cf * hd - rx * hw, y + sf * hd - ry * hw];
        const p2 = [x + cf * hd + rx * hw, y + sf * hd + ry * hw];
        const p3 = [x - cf * hd + rx * hw, y - sf * hd + ry * hw];
        const p4 = [x - cf * hd - rx * hw, y - sf * hd - ry * hw];
        tracePoly([p1, p2, p3, p4], true);
        const b1 = [x - cf * (hd + d * 0.28) - rx * hw * 1.05, y - sf * (hd + d * 0.28) - ry * hw * 1.05];
        const bm = [x - cf * (hd + d * 0.45), y - sf * (hd + d * 0.45)];
        const b2 = [x - cf * (hd + d * 0.28) + rx * hw * 1.05, y - sf * (hd + d * 0.28) + ry * hw * 1.05];
        ctx.moveTo(px(b1[0]), py(b1[1]));
        ctx.quadraticCurveTo(px(bm[0]), py(bm[1]), px(b2[0]), py(b2[1]));
      },
      wash(fn, warmGold) {
        ctx.save();
        ctx.beginPath();
        fn();
        ctx.fillStyle = warmGold
          ? `rgba(194, 120, 3, ${(0.062 * a).toFixed(4)})`
          : `rgba(15, 118, 110, ${(0.048 * a).toFixed(4)})`;
        ctx.fill();
        ctx.lineWidth = 1.75;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = warmGold
          ? `rgba(176, 110, 6, ${(0.42 * a).toFixed(4)})`
          : `rgba(13, 58, 62, ${(0.36 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      },
      tint(fn, strength, warmGold) {
        const k = strength === undefined ? 1 : strength;
        ctx.save();
        ctx.beginPath();
        fn();
        ctx.fillStyle = warmGold
          ? `rgba(194, 120, 3, ${(0.045 * k * a).toFixed(4)})`
          : `rgba(15, 118, 110, ${(0.038 * k * a).toFixed(4)})`;
        ctx.fill();
        ctx.restore();
      },
      cutout(fn) {
        ctx.save();
        ctx.beginPath();
        fn();
        ctx.fillStyle = `rgba(246, 242, 231, ${(0.76 * a).toFixed(4)})`;
        ctx.fill();
        ctx.lineWidth = 1.15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(15, 62, 66, ${(0.24 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      },
      contour(fn) {
        ctx.save();
        ctx.beginPath();
        fn();
        ctx.lineWidth = 1.48;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(14, 60, 64, ${(0.30 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      },
      sub(fn, dashed) {
        ctx.save();
        ctx.beginPath();
        if (dashed) ctx.setLineDash([4, 3.5]);
        fn();
        ctx.lineWidth = 1.12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(18, 52, 58, ${(0.21 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      },
      inner(fn, dashed) {
        ctx.save();
        ctx.beginPath();
        if (dashed) ctx.setLineDash([3.2, 3.4]);
        fn();
        ctx.lineWidth = 0.90;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(20, 35, 45, ${(0.155 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      },
      fine(fn, dashed) {
        ctx.save();
        ctx.beginPath();
        if (dashed) ctx.setLineDash([2.4, 3.2]);
        fn();
        ctx.lineWidth = 0.78;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(20, 35, 45, ${(0.11 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      },
      accent(fn, dashed) {
        ctx.save();
        ctx.beginPath();
        if (dashed) ctx.setLineDash([4, 3.5]);
        fn();
        ctx.lineWidth = 1.22;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(180, 114, 8, ${(0.30 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      }
    };

    return g;
  }

  /**
   * Renders a Natural-Earth cartographic map with optional circular atlas medallion,
   * curved graticules, lakes, rivers, and custom thematic accents.
   */
  function drawCarto(g, key, opts) {
    const m = getDecodedMap(key);
    if (!m) return;
    const o = opts || {};

    if (o.medallion) {
      const mr = o.medallion;
      // Subtle engraved atlas bezel & degree ticks
      g.fine(() => {
        g.circle(0, 0, mr + 0.032);
        g.radialTicks(0, 0, mr, mr + 0.024, 36);
        for (let y = -0.55; y <= 0.56; y += 0.55) {
          const halfX = Math.sqrt(Math.max(0, mr * mr - y * y));
          g.quad(-halfX, y, 0, y * 0.82, halfX, y);
        }
        for (let x = -0.55; x <= 0.56; x += 0.55) {
          const halfY = Math.sqrt(Math.max(0, mr * mr - x * x));
          g.quad(x, -halfY, x * 0.82, 0, x, halfY);
        }
      });
      g.sub(() => g.circle(0, 0, mr));
    } else {
      // Subtle archival chart grid behind standalone landmass
      g.fine(() => {
        g.circle(0, 0, 0.93);
        g.radialTicks(0, 0, 0.90, 0.93, 24);
        g.quad(-0.88, -0.36, 0, -0.43, 0.88, -0.36);
        g.quad(-0.92, 0.04, 0, -0.02, 0.92, 0.04);
        g.quad(-0.88, 0.44, 0, 0.39, 0.88, 0.44);
        g.quad(-0.38, -0.84, -0.31, 0, -0.38, 0.84);
        g.quad(0.38, -0.84, 0.31, 0, 0.38, 0.84);
      });
    }

    if (o.under) o.under(g);

    g.wash(() => {
      for (let i = 0; i < m.p.length; i++) {
        g.poly(m.p[i], true);
      }
    });

    if (m.l && m.l.length) {
      g.cutout(() => {
        for (let i = 0; i < m.l.length; i++) {
          g.poly(m.l[i], true);
        }
      });
    }

    if (m.r && m.r.length) {
      g.sub(() => {
        for (let i = 0; i < m.r.length; i++) {
          g.poly(m.r[i], false);
        }
      });
    }

    if (o.over) o.over(g);
  }

  /**
   * Renders the slowly spinning 3D orthographic Planetary Globe with real spherical
   * continent coastlines, rotating 3D meridians, parallels, tilted axis & orbital satellite.
   */
  function drawSpinningGlobe(g, timeSec) {
    const R = 0.94;
    const tilt = 0.21; // ~12 deg axial poise
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    const phi0 = 16.5 * DEG;
    const sp0 = Math.sin(phi0);
    const cp0 = Math.cos(phi0);
    // West-to-east prograde rotation: 1 full revolution every ~76 seconds
    const lam0 = 0.28 - (Number(timeSec) || 0) * 0.082;

    function proj(lonRad, sinPhi, cosPhi) {
      const lam = lonRad - lam0;
      const cl = Math.cos(lam);
      const sl = Math.sin(lam);
      const cc = sp0 * sinPhi + cp0 * cosPhi * cl;
      const x0 = cosPhi * sl;
      const y0 = -(cp0 * sinPhi - sp0 * cosPhi * cl);
      return [(x0 * ct - y0 * st) * R, (x0 * st + y0 * ct) * R, cc];
    }

    // 1. Polar axis pins & outer meridian graduation arc
    g.sub(() => {
      g.line(st * 1.02, -ct * 1.02, st * 0.94, -ct * 0.94);
      g.line(-st * 1.02, ct * 1.02, -st * 0.94, ct * 0.94);
    });
    g.fine(() => {
      g.arc(0, 0, 0.985, -Math.PI * 0.62 + tilt, Math.PI * 0.42 + tilt);
      g.radialTicks(0, 0, 0.965, 0.985, 19, -Math.PI * 0.62 + tilt, Math.PI * 1.04);
    });

    // 2. Ocean sphere base
    g.tint(() => g.circle(0, 0, R), 0.72);

    // 3. Rotating 3D Longitude Meridians (every 30 deg) & Latitude Parallels
    g.fine(() => {
      for (let mDeg = -180; mDeg < 180; mDeg += 30) {
        const mRad = mDeg * DEG;
        const seg = [];
        for (let latD = -80; latD <= 80; latD += 6) {
          const lr = latD * DEG;
          const p = proj(mRad, Math.sin(lr), Math.cos(lr));
          if (p[2] >= 0) {
            seg.push([p[0], p[1]]);
          } else if (seg.length > 1) {
            g.poly(seg, false);
            seg.length = 0;
          } else {
            seg.length = 0;
          }
        }
        if (seg.length > 1) g.poly(seg, false);
      }
      const parallels = [-60, -30, 30, 60];
      for (let pi = 0; pi < parallels.length; pi++) {
        const lr = parallels[pi] * DEG;
        const sp = Math.sin(lr);
        const cp = Math.cos(lr);
        const seg = [];
        for (let lonD = -180; lonD <= 180; lonD += 6) {
          const p = proj(lonD * DEG, sp, cp);
          if (p[2] >= 0) {
            seg.push([p[0], p[1]]);
          } else if (seg.length > 1) {
            g.poly(seg, false);
            seg.length = 0;
          } else {
            seg.length = 0;
          }
        }
        if (seg.length > 1) g.poly(seg, false);
      }
    });

    // 3B. Equator highlight
    g.inner(() => {
      const seg = [];
      for (let lonD = -180; lonD <= 180; lonD += 5) {
        const p = proj(lonD * DEG, 0, 1);
        if (p[2] >= 0) {
          seg.push([p[0], p[1]]);
        } else if (seg.length > 1) {
          g.poly(seg, false);
          seg.length = 0;
        } else {
          seg.length = 0;
        }
      }
      if (seg.length > 1) g.poly(seg, false);
    });

    // 4. 3D Orthographic Continents (horizon-clipped & stitched along curved limb)
    const fillPolys = [];
    const coastRuns = [];

    for (let rIdx = 0; rIdx < GLOBE_RINGS.length; rIdx++) {
      const ring = GLOBE_RINGS[rIdx];
      const n = ring.length;
      const pts3 = new Array(n);
      let maxC = -1;
      let minC = 1;
      for (let i = 0; i < n; i++) {
        const v = ring[i];
        const p = proj(v[0], v[1], v[2]);
        pts3[i] = p;
        if (p[2] > maxC) maxC = p[2];
        if (p[2] < minC) minC = p[2];
      }
      if (maxC <= 0.002) continue;
      if (minC >= 0) {
        const closed = pts3.map((p) => [p[0], p[1]]);
        fillPolys.push(closed);
        coastRuns.push({ pts: closed, closed: true });
        continue;
      }

      let firstOut = 0;
      for (let i = 0; i < n; i++) {
        if (pts3[i][2] < 0) {
          firstOut = i;
          break;
        }
      }

      const runs = [];
      let cur = null;
      for (let k = 0; k < n; k++) {
        const a = pts3[(firstOut + k) % n];
        const b = pts3[(firstOut + k + 1) % n];
        const ca = a[2];
        const cb = b[2];
        if (ca < 0 && cb >= 0) {
          const t = -ca / Math.max(1e-6, cb - ca);
          const xm = a[0] + t * (b[0] - a[0]);
          const ym = a[1] + t * (b[1] - a[1]);
          const rm = Math.hypot(xm, ym) || 1;
          cur = [[(xm / rm) * R, (ym / rm) * R]];
        } else if (ca >= 0 && cb >= 0) {
          if (cur) cur.push([a[0], a[1]]);
        } else if (ca >= 0 && cb < 0) {
          if (cur) {
            cur.push([a[0], a[1]]);
            const t = ca / Math.max(1e-6, ca - cb);
            const xm = a[0] + t * (b[0] - a[0]);
            const ym = a[1] + t * (b[1] - a[1]);
            const rm = Math.hypot(xm, ym) || 1;
            cur.push([(xm / rm) * R, (ym / rm) * R]);
            if (cur.length >= 2) runs.push(cur);
            cur = null;
          }
        }
      }

      for (let i = 0; i < runs.length; i++) {
        coastRuns.push({ pts: runs[i], closed: false });
      }

      if (runs.length > 0) {
        const m = runs.length;
        const used = new Array(m).fill(false);
        const eIn = runs.map((r) => ((Math.atan2(r[0][1], r[0][0]) % TAU) + TAU) % TAU);
        const eOut = runs.map((r) => ((Math.atan2(r[r.length - 1][1], r[r.length - 1][0]) % TAU) + TAU) % TAU);

        for (let s = 0; s < m; s++) {
          if (used[s]) continue;
          const poly = [];
          let curr = s;
          let guard = 0;
          while (!used[curr] && guard++ <= m) {
            used[curr] = true;
            for (let q = 0; q < runs[curr].length; q++) poly.push(runs[curr][q]);
            const ax = eOut[curr];
            let bestJ = 0;
            let bestDa = Infinity;
            for (let j = 0; j < m; j++) {
              const cand = ((eIn[j] - ax) % TAU + TAU) % TAU;
              if (cand < bestDa) {
                bestDa = cand;
                bestJ = j;
              }
            }
            if (bestDa < Math.PI * 1.35) {
              const steps = Math.max(1, Math.ceil(bestDa / 0.11));
              for (let stp = 1; stp < steps; stp++) {
                const ang = ax + (bestDa * stp) / steps;
                poly.push([Math.cos(ang) * R, Math.sin(ang) * R]);
              }
            }
            curr = bestJ;
          }
          if (poly.length >= 3) fillPolys.push(poly);
        }
      }
    }

    g.tint(() => {
      for (let i = 0; i < fillPolys.length; i++) g.poly(fillPolys[i], true);
    }, 1.35);

    g.contour(() => {
      for (let i = 0; i < coastRuns.length; i++) {
        g.poly(coastRuns[i].pts, coastRuns[i].closed);
      }
      g.circle(0, 0, R);
    });

    // 5. Subtle low-Earth orbital arc & tiny spacecraft node ("and a few in space")
    const satAng = -0.58 + (Number(timeSec) || 0) * 0.045;
    g.accent(() => {
      g.arc(0, 0, 1.03, satAng - 0.34, satAng + 0.34);
      const sx = Math.cos(satAng) * 1.03;
      const sy = Math.sin(satAng) * 1.03;
      g.circle(sx, sy, 0.017);
    });
  }

  // =========================================================================
  // 81 MATCHED ARCHITECTURAL & CARTOGRAPHIC PERSPECTIVE OUTLINES (27 BANDS)
  // =========================================================================
  const BANDS = [
    // --- TIER 1 · PLANETARY (10M .. 8.3B) ---
    {
      min: 8000000000,
      tier: 1,
      items: [
        {
          id: 'earth_globe',
          label: 'Whole Earth Globe',
          headline: 'There are over 8,300,000,000 humans on the planet (and a few in space). What makes you truly unique?',
          sub: '',
          draw(g, timeSec) {
            drawSpinningGlobe(g, timeSec);
          }
        }
      ]
    },
    {
      min: 3500000000,
      tier: 1,
      items: [
        {
          id: 'afro_eurasia',
          label: 'Eastern Hemisphere',
          headline: 'More than half the planet is still nodding along — enough to fill the entire Eastern Hemisphere landmass.',
          sub: 'Each dot represents one million living people.',
          draw(g) {
            drawCarto(g, 'afro_eurasia', {
              medallion: 0.92,
              over(p) {
                p.accent(() => p.quad(-0.91, 0.22, 0, 0.31, 0.91, 0.22), true);
              }
            });
          }
        },
        {
          id: 'indo_pacific_arc',
          label: 'Indo-Pacific Rim',
          headline: 'Everyone matching you so far could populate the entire Indo-Pacific coastal rim.',
          sub: 'Roughly half of humanity survived your opening cut.',
          draw(g) {
            drawCarto(g, 'indo_pacific_arc', {
              medallion: 0.92,
              over(p) {
                p.accent(() => p.arc(0.02, 0.08, 0.72, -Math.PI * 0.88, -Math.PI * 0.14), true);
              }
            });
          }
        },
        {
          id: 'azimuthal_world',
          label: 'Polar World Map',
          headline: 'Half the globe is still raising its hand across every meridian on the map.',
          sub: 'Add an uncorrelated fact to carve away whole continents.',
          draw(g) {
            drawCarto(g, 'azimuthal_world', {
              medallion: 0.92,
              under(p) {
                p.fine(() => {
                  p.circle(0, 0, 0.23);
                  p.circle(0, 0, 0.46);
                  p.circle(0, 0, 0.69);
                  p.spokes(0.08, 0.92, 12);
                });
              },
              over(p) {
                p.accent(() => p.circle(0, 0, 0.69), true);
              }
            });
          }
        }
      ]
    },
    {
      min: 1300000000,
      tier: 1,
      items: [
        {
          id: 'subcontinent_cape',
          label: 'Subcontinent Peninsula',
          headline: 'Everyone left like you could populate an entire South Asian subcontinent peninsula.',
          sub: 'Down to roughly one-sixth of the human species.',
          draw(g) {
            drawCarto(g, 'subcontinent_cape', {
              over(p) {
                p.accent(() => p.quad(-0.84, -0.14, 0, -0.18, 0.84, -0.14), true);
              }
            });
          }
        },
        {
          id: 'twin_river_basin',
          label: 'Twin-River Heartland',
          headline: 'Still enough statistical matches to fill an entire East Asian twin-river heartland.',
          sub: 'You narrowed the planet, not the billion-person crowd yet.',
          draw(g) {
            drawCarto(g, 'twin_river_basin', {
              over(p) {
                p.accent(() => p.line(0.42, -0.18, 0.52, 0.16), true);
              }
            });
          }
        },
        {
          id: 'continental_shield',
          label: 'African Continent',
          headline: 'Everyone sharing your checklist so far could populate the entire continent of Africa.',
          sub: 'Over a billion people still match every word.',
          draw(g) {
            drawCarto(g, 'continental_shield', {
              over(p) {
                p.accent(() => p.line(-0.88, 0.04, 0.88, 0.04), true);
              }
            });
          }
        }
      ]
    },
    {
      min: 600000000,
      tier: 1,
      items: [
        {
          id: 'european_peninsula',
          label: 'European Continent',
          headline: 'Everyone left like you could populate the entire European continent from coast to coast.',
          sub: 'About one in ten humans on Earth survived that cut.',
          draw(g) {
            drawCarto(g, 'european_peninsula', {
              medallion: 0.92,
              over(p) {
                p.accent(() => p.arc(0, -1.35, 1.55, Math.PI * 0.36, Math.PI * 0.64), true);
              }
            });
          }
        },
        {
          id: 'cordillera_basin',
          label: 'Western Americas',
          headline: 'Everyone matching you could span the Americas from northern tundra down to the southern cape.',
          sub: 'Hundreds of millions of people still share this combination.',
          draw(g) {
            drawCarto(g, 'cordillera_basin', {
              over(p) {
                p.accent(() => p.line(-0.86, 0.08, 0.86, 0.08), true);
              }
            });
          }
        },
        {
          id: 'archipelago_basin',
          label: 'Southeast Asian Seas',
          headline: 'Everyone left like you could populate the entire Southeast Asian maritime basin.',
          sub: 'Pick a trait from a fresh category for a sharper cut.',
          draw(g) {
            drawCarto(g, 'archipelago_basin', {
              medallion: 0.92,
              over(p) {
                p.accent(() => p.line(-0.90, 0.22, 0.90, 0.22), true);
              }
            });
          }
        }
      ]
    },
    {
      min: 250000000,
      tier: 1,
      items: [
        {
          id: 'coast_to_coast_usa',
          label: 'Continental United States',
          headline: 'Roughly one entire continental United States of statistical lookalikes remaining.',
          sub: 'Coast-to-coast traffic if you all met up at once.',
          draw(g) {
            drawCarto(g, 'coast_to_coast_usa', {
              over(p) {
                p.accent(() => p.quad(-0.78, -0.02, 0, 0.05, 0.78, -0.02), true);
              }
            });
          }
        },
        {
          id: 'volcanic_archipelago',
          label: 'Indonesian Archipelago',
          headline: 'Everyone matching your stack could populate every island of the Indonesian archipelago.',
          sub: 'Down to a few percent of Earth’s population.',
          draw(g) {
            drawCarto(g, 'volcanic_archipelago', {
              over(p) {
                p.accent(() => p.quad(-0.86, 0.06, -0.10, 0.34, 0.62, 0.24), true);
              }
            });
          }
        },
        {
          id: 'continental_plains',
          label: 'Continental Heartland',
          headline: 'Everyone left like you fills an entire ocean-to-ocean continental heartland.',
          sub: 'Still hundreds of millions strong — keep stacking.',
          draw(g) {
            drawCarto(g, 'continental_plains', {
              over(p) {
                p.accent(() => p.quad(-0.56, 0.16, 0, 0.24, 0.54, 0.16), true);
              }
            });
          }
        }
      ]
    },
    {
      min: 115000000,
      tier: 1,
      items: [
        {
          id: 'amazon_shield',
          label: 'Brazilian Heartland',
          headline: 'Everyone left matching you could fill all of Brazil from the Amazon basin to the Atlantic.',
          sub: 'Down to low single-digit percentages of humanity.',
          draw(g) {
            drawCarto(g, 'amazon_shield', {
              over(p) {
                p.accent(() => p.line(-0.84, -0.50, 0.76, -0.50), true);
              }
            });
          }
        },
        {
          id: 'four_island_arc',
          label: 'Japanese Archipelago',
          headline: 'Roughly one entire Japanese four-island archipelago of people still matching your checklist.',
          sub: 'Switch categories so correlation dampening doesn’t soften the cut.',
          draw(g) {
            drawCarto(g, 'four_island_arc', {
              over(p) {
                p.accent(() => p.quad(0.58, -0.44, 0.36, 0.18, -0.18, 0.68), true);
              }
            });
          }
        },
        {
          id: 'bi_oceanic_isthmus',
          label: 'Mexican Highlands & Gulf',
          headline: 'Everyone left like you matches the scale of Mexico from Pacific coast to Gulf peninsula.',
          sub: 'Over 98% of the planet has already been ruled out.',
          draw(g) {
            drawCarto(g, 'bi_oceanic_isthmus', {
              over(p) {
                p.accent(() => p.line(-0.84, 0.02, 0.84, 0.02), true);
              }
            });
          }
        }
      ]
    },
    {
      min: 45000000,
      tier: 1,
      items: [
        {
          id: 'mediterranean_boot',
          label: 'Italian Peninsula',
          headline: 'Everyone matching your profile could populate the entire Italian peninsula and Sicily.',
          sub: 'Entering midgame territory — time to get more specific.',
          draw(g) {
            drawCarto(g, 'mediterranean_boot', {
              over(p) {
                p.accent(() => p.quad(-0.34, -0.54, 0.06, -0.06, 0.42, 0.48), true);
              }
            });
          }
        },
        {
          id: 'iberian_shield',
          label: 'Iberian Peninsula',
          headline: 'Everyone left like you could populate the entire Iberian peninsula.',
          sub: 'Less than 1% of humanity still shares all your facts.',
          draw(g) {
            drawCarto(g, 'iberian_shield', {
              over(p) {
                p.accent(() => p.line(-0.10, -0.62, 0.62, -0.44), true);
              }
            });
          }
        },
        {
          id: 'river_delta_fan',
          label: 'Nile River & Delta',
          headline: 'Everyone still matching you could line the entire Nile valley and coastal fan delta.',
          sub: 'One solid niche trait will drop you under 10 million.',
          draw(g) {
            drawCarto(g, 'river_delta_fan', {
              medallion: 0.92,
              over(p) {
                p.accent(() => p.line(-0.88, 0.48, 0.88, 0.48), true);
              }
            });
          }
        }
      ]
    },
    {
      min: 10000000,
      tier: 1,
      items: [
        {
          id: 'tokyo_bay_loops',
          label: 'Tokyo Bay Megacity',
          headline: 'Everyone left like you fits inside Greater Tokyo’s bayfront expressway rings.',
          sub: 'One more cut triggers the 10M Metropolis camera zoom.',
          draw(g) {
            // Circular urban plan enclosing Kanto plain & recessed Tokyo Bay
            g.wash(() => g.circle(0, 0, 0.93));
            // Tokyo Bay water cutout (Miura west, Boso east, Uraga channel south)
            g.cutout(() =>
              g.poly(
                [
                  [-0.08, 0.89], [-0.14, 0.62], [-0.08, 0.36], [-0.02, 0.14],
                  [0.14, 0.02], [0.36, 0.04], [0.46, 0.22], [0.38, 0.46],
                  [0.24, 0.62], [0.28, 0.88]
                ],
                true
              )
            );
            // Reclaimed Odaiba / Haneda harbor islands
            g.sub(() => {
              g.rrect(0.06, 0.16, 0.09, 0.06, 0.01);
              g.rrect(-0.02, 0.29, 0.10, 0.06, 0.01);
              g.rrect(0.24, 0.15, 0.08, 0.05, 0.01);
              // Sumida, Arakawa & Tama rivers feeding into Tokyo Bay
              g.smooth([[-0.42, -0.78], [-0.16, -0.44], [0.02, -0.18], [0.06, 0.04]], false);
              g.smooth([[-0.18, -0.84], [0.08, -0.48], [0.16, -0.16], [0.18, 0.03]], false);
              g.smooth([[-0.82, 0.14], [-0.42, 0.24], [-0.08, 0.34]], false);
            });
            // Concentric Yamanote, C2 & Gaikan expressway rings + Imperial Palace moat
            g.contour(() => {
              g.ellipse(-0.08, -0.10, 0.22, 0.28, -0.12);
              g.poly([[-0.12, -0.14], [-0.05, -0.16], [-0.03, -0.09], [-0.10, -0.07]], true);
            });
            g.inner(() => {
              g.circle(-0.08, -0.10, 0.48);
              g.arc(-0.08, -0.10, 0.74, -Math.PI * 1.15, Math.PI * 0.12);
              // Radial Shinkansen / expressway spokes
              const spokes = [-2.65, -2.15, -1.62, -1.08, -0.42, 2.55];
              for (let i = 0; i < spokes.length; i++) {
                const a = spokes[i];
                g.line(-0.08 + Math.cos(a) * 0.24, -0.10 + Math.sin(a) * 0.24, Math.cos(a) * 0.92, Math.sin(a) * 0.92);
              }
            });
            // Tokyo Bay Aqua-Line bridge-tunnel span
            g.accent(() => g.line(-0.06, 0.42, 0.38, 0.36));
          }
        },
        {
          id: 'five_borough_harbor',
          label: 'New York Harbor Metro',
          headline: 'Everyone matching your checklist fits inside the New York Harbor metropolitan region.',
          sub: 'Right on the doorstep of the 10M Metropolis zoom.',
          draw(g) {
            g.fine(() => {
              g.circle(0, 0, 0.93);
              g.radialTicks(0, 0, 0.90, 0.93, 36);
            });
            g.tint(() => g.circle(0, 0, 0.93), 0.30);
            g.wash(() => {
              // Sculpted Manhattan Island (Battery to Inwood)
              g.smooth(
                [
                  [-0.08, 0.17], [-0.11, 0.02], [-0.07, -0.18], [0.02, -0.44],
                  [0.12, -0.70], [0.19, -0.67], [0.11, -0.40], [0.05, -0.14],
                  [0.02, 0.06], [-0.03, 0.19]
                ],
                true
              );
              // Brooklyn & Queens (Red Hook, Bay Ridge, Coney Island, Jamaica Bay, Astoria, Flushing)
              g.smooth(
                [
                  [0.05, 0.22], [0.08, 0.10], [0.12, -0.04], [0.16, -0.22],
                  [0.32, -0.34], [0.54, -0.30], [0.84, -0.28], [0.89, 0.08],
                  [0.78, 0.42], [0.52, 0.56], [0.46, 0.44], [0.34, 0.58],
                  [0.10, 0.64], [0.00, 0.52], [0.05, 0.36]
                ],
                true
              );
              // The Bronx (across Harlem River & East River)
              g.smooth(
                [
                  [0.15, -0.74], [0.08, -0.88], [0.44, -0.87], [0.68, -0.58],
                  [0.54, -0.44], [0.34, -0.42], [0.22, -0.62]
                ],
                true
              );
              // Staten Island (across The Narrows & Kill Van Kull)
              g.smooth(
                [
                  [-0.48, 0.40], [-0.24, 0.34], [-0.12, 0.46], [-0.18, 0.64],
                  [-0.38, 0.80], [-0.58, 0.76], [-0.58, 0.56]
                ],
                true
              );
              // New Jersey Palisades, Hoboken, Jersey City & Bayonne Peninsula
              g.smooth(
                [
                  [-0.86, -0.34], [-0.46, -0.74], [-0.10, -0.88], [-0.04, -0.76],
                  [-0.16, -0.36], [-0.20, -0.04], [-0.24, 0.16], [-0.30, 0.28],
                  [-0.40, 0.26], [-0.42, 0.08], [-0.58, 0.28], [-0.87, 0.24]
                ],
                true
              );
            });
            // Central Park, Prospect Park, Governors/Ellis/Liberty Islands & Borough Street Grids!
            g.cutout(() =>
              g.poly([[-0.01, -0.22], [0.05, -0.45], [0.10, -0.43], [0.04, -0.20]], true)
            );
            g.inner(() => {
              g.circle(-0.07, 0.26, 0.028); // Governors Island
              g.circle(-0.15, 0.24, 0.016); // Liberty Island
              g.ellipse(0.22, 0.32, 0.06, 0.045, 0.4); // Prospect Park
              // Brooklyn / Queens / NJ arterial grids
              for (let y = -0.14; y <= 0.26; y += 0.13) {
                g.line(0.18, y, 0.78, y - 0.04);
              }
              for (let x = 0.26; x <= 0.68; x += 0.14) {
                g.line(x, -0.22, x - 0.06, 0.46);
              }
              g.line(-0.28, -0.28, -0.78, -0.22);
              g.line(-0.28, -0.06, -0.78, 0.02);
              g.line(-0.34, 0.56, -0.52, 0.68);
            });
            // 7 Iconic Harbor Bridges (Verrazzano, Brooklyn, Manhattan, Williamsburg, Queensboro, RFK, GW)
            g.accent(() => {
              g.line(-0.12, 0.47, 0.01, 0.51);  // Verrazzano-Narrows
              g.line(-0.03, 0.14, 0.08, 0.17);  // Brooklyn Bridge
              g.line(0.00, 0.08, 0.10, 0.10);   // Manhattan Bridge
              g.line(0.02, 0.00, 0.12, 0.01);   // Williamsburg
              g.line(0.05, -0.18, 0.16, -0.16); // Queensboro
              g.line(0.11, -0.40, 0.26, -0.36); // RFK Triborough
              g.line(-0.06, -0.60, 0.09, -0.58); // George Washington
            });
          }
        },
        {
          id: 'river_beltway_metro',
          label: 'Seoul River Beltway',
          headline: 'Everyone remaining fits inside one river-bisected megacity beltway.',
          sub: 'Under 10 million unlocks 1-dot-equals-1,000-people.',
          draw(g) {
            // Outer Capital Ring Expressway
            g.wash(() => g.superEllipse(0.93, 0.84, 2.7));
            // Winding double-bank Han River + Yeouido Island
            g.cutout(() =>
              g.poly(
                [
                  [-0.92, -0.06], [-0.56, 0.08], [-0.22, 0.14], [0.14, -0.04],
                  [0.52, 0.04], [0.92, -0.08], [0.92, 0.06], [0.52, 0.18],
                  [0.14, 0.10], [-0.24, 0.28], [-0.58, 0.20], [-0.92, 0.06]
                ],
                true
              )
            );
            // Yeouido Island in the Han River + Bukhansan & Namsan contours
            g.contour(() => {
              g.ellipse(-0.24, 0.21, 0.11, 0.035, -0.15);
              // Historic Hanyang Fortress Wall loop north of river
              g.smooth(
                [
                  [-0.24, -0.36], [-0.04, -0.52], [0.20, -0.40],
                  [0.22, -0.18], [-0.02, -0.12], [-0.24, -0.20]
                ],
                true
              );
            });
            // Gangnam orthogonal boulevard grid (south) & Han River bridges
            g.inner(() => {
              for (let x = -0.48; x <= 0.56; x += 0.20) {
                g.line(x, 0.22, x, 0.68);
              }
              for (let y = 0.34; y <= 0.64; y += 0.15) {
                g.line(-0.62, y, 0.66, y);
              }
              // Bukhansan mountain ridge ticks north
              g.smooth([[-0.44, -0.66], [-0.12, -0.76], [0.18, -0.68], [0.44, -0.60]], false);
            });
            // Iconic Han River Bridges
            g.accent(() => {
              const bx = [-0.62, -0.42, -0.26, -0.12, 0.04, 0.20, 0.36, 0.54, 0.72];
              const by = [0.10, 0.16, 0.21, 0.18, 0.08, 0.04, 0.09, 0.11, 0.04];
              for (let i = 0; i < bx.length; i++) {
                g.line(bx[i], by[i] - 0.09, bx[i] + 0.02, by[i] + 0.09);
              }
            });
          }
        }
      ]
    },

    // --- TIER 2 · METROPOLIS (10,000 .. 9,999,999) ---
    {
      min: 3500000,
      tier: 2,
      items: [
        {
          id: 'thames_orbital',
          label: 'London Orbital Beltway',
          headline: 'Everyone left like you fits inside London’s orbital beltway along the winding Thames.',
          sub: 'Every dot on screen now represents 1,000 living humans.',
          draw(g) {
            // Authentic M25 London Orbital motorway polygon + radial M-motorway stubs
            g.fine(() => {
              const mStubs = [-2.5, -1.9, -1.3, -0.5, 0.7, 1.5, 2.2, 2.9];
              for (let i = 0; i < mStubs.length; i++) {
                const a = mStubs[i];
                g.line(Math.cos(a) * 0.84, Math.sin(a) * 0.84, Math.cos(a) * 0.97, Math.sin(a) * 0.97);
              }
            });
            g.wash(() =>
              g.poly(
                [
                  [-0.38, -0.84], [0.06, -0.88], [0.46, -0.80], [0.76, -0.56],
                  [0.90, -0.18], [0.89, 0.22], [0.70, 0.62], [0.28, 0.85],
                  [-0.28, 0.86], [-0.72, 0.64], [-0.90, 0.18], [-0.85, -0.36],
                  [-0.64, -0.68]
                ],
                true
              )
            );
            // Famous double-bank meandering River Thames (Richmond -> Westminster -> Isle of Dogs -> Estuary)
            g.cutout(() =>
              g.poly(
                [
                  [-0.90, 0.27], [-0.68, 0.17], [-0.52, 0.25], [-0.38, 0.09],
                  [-0.20, 0.13], [-0.06, 0.02], [0.10, 0.02], [0.16, 0.18],
                  [0.25, 0.18], [0.29, 0.02], [0.52, 0.05], [0.74, 0.00], [0.91, -0.04],
                  [0.91, 0.09], [0.74, 0.10], [0.52, 0.13], [0.33, 0.09],
                  [0.29, 0.24], [0.12, 0.24], [0.07, 0.08], [-0.05, 0.08],
                  [-0.20, 0.19], [-0.37, 0.15], [-0.52, 0.31], [-0.68, 0.23], [-0.90, 0.32]
                ],
                true
              )
            );
            // North/South Circular inner beltway, City of London core, Royal Parks & Canary Wharf docks
            g.sub(() => g.ellipse(-0.04, 0.02, 0.48, 0.40), true);
            g.contour(() => {
              g.rrect(-0.01, -0.03, 0.12, 0.07, 0.01); // Square Mile / City of London
              g.rrect(0.21, 0.10, 0.08, 0.04, 0);      // Canary Wharf West India Docks
            });
            g.inner(() => {
              g.rrect(-0.22, -0.02, 0.14, 0.09, 0.02); // Hyde Park & Kensington Gardens
              g.circle(-0.16, -0.18, 0.055);           // Regent's Park
              g.ellipse(-0.46, 0.36, 0.08, 0.06);      // Richmond Park
              // Lee Valley reservoir chain running north
              g.line(0.24, -0.82, 0.22, -0.02);
              // Heathrow parallel east-west runways on west edge
              g.line(-0.82, 0.04, -0.66, 0.04);
              g.line(-0.82, 0.09, -0.66, 0.09);
              for (let i = 0; i < 12; i++) {
                const a = (i / 12) * TAU + 0.15;
                g.line(Math.cos(a) * 0.16, Math.sin(a) * 0.14, Math.cos(a) * 0.82, Math.sin(a) * 0.80);
              }
            });
            // Westminster, Blackfriars, London, Tower Bridge & Dartford Crossing spans
            g.accent(() => {
              g.line(-0.10, 0.05, -0.08, 0.13);
              g.line(-0.02, 0.01, -0.02, 0.09);
              g.line(0.05, 0.01, 0.05, 0.09);
              g.line(0.86, -0.04, 0.86, 0.10);
            });
          }
        },
        {
          id: 'twin_island_strait',
          label: 'New Zealand Twin Islands',
          headline: 'Everyone matching your checklist could populate New Zealand’s North and South Islands.',
          sub: 'More than 99.9% of Earth has been eliminated.',
          draw(g) {
            drawCarto(g, 'twin_island_strait', {
              over(p) {
                p.accent(() => p.quad(-0.56, 0.68, -0.18, 0.34, 0.06, 0.10), true);
              }
            });
          }
        },
        {
          id: 'alpine_republic',
          label: 'Swiss Alpine Valleys',
          headline: 'Everyone left like you fits across the mountain valleys and lakes of Switzerland.',
          sub: 'Every dot on screen stands for 1,000 people.',
          draw(g) {
            drawCarto(g, 'alpine_republic', {
              over(p) {
                p.accent(() => p.quad(-0.52, 0.24, 0.04, 0.12, 0.62, 0.08), true);
              }
            });
          }
        }
      ]
    },
    {
      min: 1200000,
      tier: 2,
      items: [
        {
          id: 'manhattan_island',
          label: 'Manhattan Island',
          headline: 'Everyone left matching you fits onto the street grid of Manhattan Island.',
          sub: 'Central Park included — 99.97% of humanity is gone.',
          draw(g) {
            g.fine(() => g.circle(0, 0, 0.93));
            // Surrounding NJ Palisades (left) & Brooklyn/Queens shorelines (right)
            g.sub(() => {
              g.smooth([[-0.32, -0.90], [-0.52, -0.36], [-0.74, 0.28], [-0.82, 0.72]], false);
              g.smooth([[0.64, -0.68], [0.46, -0.18], [0.24, 0.32], [0.06, 0.86]], false);
              // Roosevelt Island in East River
              g.poly([[0.22, -0.14], [0.26, -0.12], [0.13, 0.16], [0.09, 0.14]], true);
              // Governors Island off Battery
              g.circle(-0.34, 0.86, 0.045);
            });
            // Manhattan Island silhouette (tilted 29 deg NNE)
            g.wash(() =>
              g.poly(
                [
                  [0.34, -0.88], [0.44, -0.82], [0.42, -0.64], [0.34, -0.44],
                  [0.24, -0.26], [0.18, -0.06], [0.06, 0.20], [-0.10, 0.56],
                  [-0.24, 0.78], [-0.38, 0.80], [-0.46, 0.68], [-0.42, 0.44],
                  [-0.26, 0.08], [-0.08, -0.30], [0.12, -0.66], [0.26, -0.84]
                ],
                true
              )
            );
            // Central Park rectangle + Reservoir cutout
            g.cutout(() =>
              g.poly([[-0.03, -0.28], [0.11, -0.21], [-0.08, 0.19], [-0.22, 0.12]], true)
            );
            // Manhattan Avenue & Cross-Street Grid + West Side finger piers
            g.inner(() => {
              g.ellipse(-0.04, -0.06, 0.045, 0.065, 0.46); // Reservoir
              // Longitudinal avenues
              for (let off = -0.10; off <= 0.11; off += 0.07) {
                g.line(-0.18 + off, 0.20 + off * 0.45, -0.37 + off, 0.62 + off * 0.45);
              }
              // Cross streets
              for (let t = 0.15; t <= 0.88; t += 0.12) {
                const cx0 = 0.24 - t * 0.64;
                const cy0 = -0.66 + t * 1.32;
                g.line(cx0 - 0.13, cy0 - 0.06, cx0 + 0.13, cy0 + 0.06);
              }
            });
            // Diagonal slash of Broadway + East/Hudson River Bridges
            g.accent(() => {
              g.smooth([[0.34, -0.84], [0.14, -0.44], [-0.14, 0.22], [-0.36, 0.77]], false);
              g.line(-0.20, 0.72, -0.04, 0.78); // Brooklyn Bridge
              g.line(-0.16, 0.64, 0.00, 0.70);  // Manhattan Bridge
              g.line(-0.08, 0.48, 0.09, 0.54);  // Williamsburg
              g.line(0.10, 0.08, 0.27, 0.16);   // Queensboro
              g.line(0.14, -0.64, -0.12, -0.76); // George Washington Bridge
            });
          }
        },
        {
          id: 'paris_boulevard_star',
          label: 'Paris Ring Boulevard',
          headline: 'Everyone remaining fits inside the ringed boulevards of central Paris.',
          sub: 'All twenty arrondissements along the curve of the Seine.',
          draw(g) {
            // Intramuros Boulevard Périphérique + Bois de Boulogne (W) & Bois de Vincennes (E)
            g.sub(() => {
              g.poly([[-0.82, -0.18], [-0.96, -0.08], [-0.94, 0.20], [-0.76, 0.18]], true);
              g.poly([[0.78, 0.18], [0.96, 0.22], [0.94, 0.44], [0.72, 0.40]], true);
            });
            g.wash(() =>
              g.poly(
                [
                  [-0.56, -0.62], [0.06, -0.74], [0.62, -0.58], [0.84, -0.18],
                  [0.80, 0.32], [0.42, 0.68], [-0.18, 0.72], [-0.68, 0.52],
                  [-0.84, 0.12], [-0.78, -0.32]
                ],
                true
              )
            );
            // Sweeping northern arch of the River Seine (double bank) + Île de la Cité
            g.cutout(() =>
              g.poly(
                [
                  [-0.72, 0.48], [-0.56, 0.14], [-0.34, -0.04], [-0.04, -0.02],
                  [0.24, 0.12], [0.58, 0.44], [0.50, 0.52], [0.20, 0.22],
                  [-0.06, 0.08], [-0.32, 0.06], [-0.48, 0.22], [-0.64, 0.54]
                ],
                true
              )
            );
            // Île de la Cité & Place de l'Étoile (Arc de Triomphe) 12-avenue star
            g.contour(() => {
              g.ellipse(0.02, 0.05, 0.075, 0.024, 0.28);
              g.circle(-0.38, -0.22, 0.055);
            });
            g.inner(() => {
              g.radialTicks(-0.38, -0.22, 0.06, 0.36, 12);
              // Inner Grands Boulevards loop
              g.ellipse(0.02, -0.04, 0.48, 0.38);
              // Louvre courtyard & Champ de Mars
              g.rrect(-0.02, -0.06, 0.12, 0.07, 0.01);
              g.poly([[-0.44, 0.10], [-0.36, 0.14], [-0.24, 0.38], [-0.32, 0.42]], true);
            });
            // Axe Historique (Arc de Triomphe -> Champs-Élysées -> Concorde -> Louvre) & Seine bridges
            g.accent(() => {
              g.line(-0.74, -0.38, -0.04, -0.06);
              g.line(-0.34, -0.06, -0.30, 0.08);
              g.line(-0.14, -0.04, -0.14, 0.09);
              g.line(0.02, -0.02, 0.02, 0.11);
              g.line(0.22, 0.10, 0.18, 0.23);
            });
          }
        },
        {
          id: 'ringstrasse_city',
          label: 'Vienna Ringstrasse',
          headline: 'Everyone left like you fits inside a historic ringed European capital like Vienna.',
          sub: 'You have narrowed 8.3 billion down to a single city.',
          draw(g) {
            // Outer Gürtel ring & Vienna city medallion
            g.wash(() => g.circle(0, 0, 0.91));
            // Diagonal Danube + Donauinsel on the northeast & Donaukanal grazing the Ring
            g.cutout(() =>
              g.poly(
                [
                  [-0.22, -0.89], [-0.08, -0.89], [0.89, 0.08], [0.89, 0.22]
                ],
                true
              )
            );
            g.sub(() => {
              // Donauinsel center strip
              g.line(-0.15, -0.89, 0.89, 0.15);
              // Curved Donaukanal hugging the NE edge of the Innere Stadt
              g.smooth([[-0.38, -0.78], [-0.04, -0.38], [0.24, -0.12], [0.74, 0.36]], false);
              // Gürtel beltway arc
              g.arc(-0.06, 0.08, 0.64, Math.PI * 0.22, Math.PI * 1.48);
            });
            // Iconic Octagonal Horseshoe Ringstraße around Innere Stadt
            g.contour(() => {
              g.poly(
                [
                  [-0.12, -0.34], [0.16, -0.10], [0.18, 0.16], [0.02, 0.34],
                  [-0.26, 0.34], [-0.42, 0.16], [-0.42, -0.12], [-0.26, -0.28]
                ],
                true
              );
              // Hofburg Palace wing & Stephansdom core
              g.rrect(-0.24, 0.16, 0.16, 0.10, 0.01);
              g.circle(-0.12, 0.04, 0.045);
            });
            // Monumental Ringstraße civic palaces & radial Baroque avenues + Belvedere gardens
            g.inner(() => {
              g.rrect(-0.47, 0.02, 0.07, 0.14, 0.01); // Parliament / Rathaus
              g.rrect(-0.12, 0.40, 0.14, 0.07, 0.01); // Staatsoper
              g.poly([[-0.04, 0.42], [0.08, 0.42], [0.14, 0.76], [-0.02, 0.76]], true); // Belvedere
              const rads = [0.65, 1.15, 1.75, 2.35, 2.95, 3.55, 4.15];
              for (let i = 0; i < rads.length; i++) {
                const a = rads[i];
                g.line(-0.12 + Math.cos(a) * 0.34, 0.06 + Math.sin(a) * 0.34, Math.cos(a) * 0.88, Math.sin(a) * 0.88);
              }
            });
            g.accent(() => {
              g.line(0.10, -0.44, 0.24, -0.30); // Reichsbrücke across Danube
              g.line(0.36, -0.18, 0.50, -0.04);
            });
          }
        }
      ]
    },
    {
      min: 450000,
      tier: 2,
      items: [
        {
          id: 'bay_peninsula_city',
          label: 'San Francisco Peninsula',
          headline: 'Everyone left like you could live inside San Francisco’s 7-by-7-mile bay peninsula.',
          sub: 'Street parking would still be tough, though.',
          draw(g) {
            g.fine(() => g.circle(0, 0, 0.94));
            g.tint(() => g.circle(0, 0, 0.94), 0.26);
            // Marin Headlands coves across the Golden Gate + Alcatraz + Yerba Buena / Treasure Island
            g.wash(() => {
              g.smooth(
                [
                  [-0.68, -0.84], [-0.22, -0.92], [-0.14, -0.78], [-0.24, -0.68],
                  [-0.36, -0.74], [-0.46, -0.68], [-0.62, -0.72]
                ],
                true
              );
              g.ellipse(0.04, -0.64, 0.045, 0.024, -0.3); // Alcatraz Island
              g.poly([[0.64, -0.44], [0.75, -0.40], [0.72, -0.20], [0.62, -0.24]], true); // Treasure / Yerba Buena
              // Detailed 7x7 San Francisco Peninsula coastline (Fort Pt, Lands End, Ocean Beach, Marina, Embarcadero, Hunters Pt)
              g.poly(
                [
                  [-0.70, -0.26], [-0.64, -0.38], [-0.46, -0.50], [-0.40, -0.54],
                  [-0.24, -0.44], [-0.04, -0.46], [0.14, -0.48], [0.26, -0.44],
                  [0.44, -0.22], [0.45, 0.04], [0.42, 0.14], [0.48, 0.22],
                  [0.50, 0.44], [0.60, 0.56], [0.50, 0.66], [0.54, 0.84],
                  [-0.56, 0.84], [-0.62, 0.34], [-0.68, -0.10]
                ],
                true
              );
            });
            // Golden Gate Park + Panhandle, Presidio, Lake Merced & Twin Peaks elevation rings
            g.cutout(() => g.ellipse(-0.48, 0.66, 0.055, 0.10, -0.2)); // Lake Merced
            g.contour(() => {
              g.rrect(-0.32, 0.08, 0.66, 0.13, 0.01); // Golden Gate Park
              g.rrect(0.08, 0.08, 0.14, 0.04, 0);     // Panhandle
              g.ellipse(-0.08, 0.36, 0.10, 0.14, 0.22); // Twin Peaks / Mt Sutro
              g.ellipse(-0.08, 0.36, 0.045, 0.07, 0.22);
            });
            // Full Sunset, Richmond, Downtown, Mission & SoMa street grids + Embarcadero finger piers!
            g.inner(() => {
              // Sunset & Richmond north-south avenues
              for (let x = -0.56; x <= -0.10; x += 0.115) {
                g.line(x, -0.36, x, -0.01);
                g.line(x, 0.16, x + 0.03, 0.78);
              }
              // East-west streets across Sunset, Richmond & Pacific Heights
              for (let y = -0.34; y <= -0.06; y += 0.12) g.line(-0.60, y, 0.30, y);
              for (let y = 0.24; y <= 0.74; y += 0.15) g.line(-0.56, y, 0.44, y);
              // Market Street diagonal + angled SoMa grid
              g.line(-0.04, 0.24, 0.41, -0.21);
              g.line(0.06, 0.28, 0.44, -0.10);
              g.line(0.16, 0.32, 0.45, 0.03);
              // Embarcadero finger piers along NE waterfront
              for (let t = 0; t < 7; t++) {
                const px0 = 0.24 + t * 0.034;
                const py0 = -0.44 + t * 0.055;
                g.line(px0, py0, px0 + 0.065, py0 - 0.04);
              }
            });
            // Golden Gate Bridge & SF–Oakland Bay Bridge spans in warm brass
            g.accent(() => {
              g.line(-0.42, -0.52, -0.42, -0.69); // Golden Gate Bridge
              g.line(-0.46, -0.56, -0.38, -0.56); // South tower
              g.line(-0.46, -0.65, -0.38, -0.65); // North tower
              g.line(0.41, -0.18, 0.64, -0.32);   // Bay Bridge West Span
              g.line(0.73, -0.34, 0.93, -0.40);   // Bay Bridge East Span
            });
          }
        },
        {
          id: 'canal_rings_city',
          label: 'Amsterdam Canal Rings',
          headline: 'Everyone matching your profile fits along Amsterdam’s concentric horseshoe canals.',
          sub: 'Down to a single compact harbor city.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.92));
            // IJ Harbor channel across top + Centraal Station island
            g.cutout(() =>
              g.poly(
                [
                  [-0.89, -0.24], [0.89, -0.24], [0.82, -0.42], [-0.82, -0.42]
                ],
                true
              )
            );
            g.contour(() => {
              g.rrect(0, -0.26, 0.26, 0.07, 0.01); // Centraal Station island
              // Amstel River flowing north into Damrak
              g.poly([[-0.03, 0.90], [-0.02, -0.22], [0.03, -0.22], [0.04, 0.90]], false);
            });
            // 4 UNESCO polygonal-concentric horseshoe canals (Singel, Herengracht, Keizersgracht, Prinsengracht)
            g.sub(() => {
              const radii = [0.26, 0.39, 0.52, 0.65];
              for (let rIdx = 0; rIdx < radii.length; rIdx++) {
                const r = radii[rIdx];
                const pts = [];
                const segs = 9;
                for (let k = 0; k <= segs; k++) {
                  const ang = 0.10 + (k / segs) * (Math.PI - 0.20);
                  pts.push([Math.cos(ang) * r * 1.08, -0.22 + Math.sin(ang) * r]);
                }
                g.poly(pts, false);
              }
            });
            // Historic 17th-century Singelgracht star-fortress outer moat with 14 angular bastions!
            g.inner(() => {
              const bastions = [];
              const bSegs = 28;
              for (let k = 0; k <= bSegs; k++) {
                const ang = 0.08 + (k / bSegs) * (Math.PI - 0.16);
                const rOut = k % 2 === 1 ? 0.82 : 0.74;
                bastions.push([Math.cos(ang) * rOut * 1.04, -0.22 + Math.sin(ang) * rOut]);
              }
              g.poly(bastions, false);
              // Radial streets & bridges across the Grachtengordel
              g.radialTicks(0, -0.22, 0.18, 0.74, 11, 0.22, Math.PI - 0.44);
            });
            // Dam Square & Royal Palace heart
            g.accent(() => g.rrect(0, -0.06, 0.11, 0.08, 0.01));
          }
        },
        {
          id: 'grand_canal_lagoon',
          label: 'Venetian Lagoon',
          headline: 'Everyone left like you fits across the islands and Grand Canal of a lagoon city.',
          sub: 'Less than one ten-thousandth of humanity remains.',
          draw(g) {
            // Venetian Lagoon medallion + navigation channels (bricole)
            g.fine(() => {
              g.ellipse(0, 0, 0.95, 0.82);
              g.smooth([[-0.88, 0.18], [-0.46, 0.26], [0.22, 0.24], [0.80, 0.14]], false);
            });
            g.tint(() => g.ellipse(0, 0, 0.95, 0.82), 0.28);
            g.wash(() => {
              // Sculpted Fish-shaped Historic Venice (6 Sestieri + Sant'Elena tail + Tronchetto)
              g.smooth(
                [
                  [-0.74, -0.06], [-0.66, -0.22], [-0.52, -0.36], [-0.28, -0.42],
                  [-0.02, -0.36], [0.18, -0.34], [0.44, -0.24], [0.68, -0.08],
                  [0.74, 0.08], [0.62, 0.26], [0.46, 0.20], [0.26, 0.16],
                  [0.08, 0.14], [-0.08, 0.22], [-0.38, 0.20], [-0.62, 0.10],
                  [-0.74, 0.04]
                ],
                true
              );
              // Segmented crescent of Giudecca Island across the Giudecca Canal + San Giorgio Maggiore
              g.smooth(
                [
                  [-0.56, 0.30], [-0.28, 0.33], [0.02, 0.30], [0.18, 0.27],
                  [0.16, 0.39], [-0.08, 0.44], [-0.36, 0.42], [-0.58, 0.38]
                ],
                true
              );
              g.ellipse(0.28, 0.31, 0.07, 0.05);   // San Giorgio Maggiore
              g.rrect(0.12, -0.47, 0.09, 0.07, 0.01); // Isola di San Michele
              g.ellipse(0.18, -0.62, 0.16, 0.09);  // Murano
              // Lido barrier island on the east guarding the Adriatic inlet
              g.poly([[0.82, -0.30], [0.88, -0.28], [0.70, 0.60], [0.64, 0.58]], true);
            });
            // Sinuous reverse-S Grand Canal + Arsenale Darsena Grande cutout!
            g.cutout(() => {
              g.poly(
                [
                  [-0.62, -0.14], [-0.34, -0.21], [-0.04, -0.18], [0.06, -0.04],
                  [-0.18, 0.04], [-0.14, 0.15], [0.14, 0.14], [0.14, 0.20],
                  [-0.20, 0.20], [-0.26, 0.02], [-0.02, -0.06], [-0.08, -0.12],
                  [-0.34, -0.15], [-0.62, -0.08]
                ],
                true
              );
              g.rrect(0.46, -0.05, 0.15, 0.11, 0.01); // Arsenale dock basin
            });
            // Internal Cannaregio & sestieri canals (rii), Murano canal & Piazza San Marco
            g.inner(() => {
              g.line(-0.48, -0.32, -0.22, -0.20); // Cannaregio parallel canals
              g.line(-0.42, -0.36, -0.14, -0.23);
              g.line(0.12, -0.32, 0.26, 0.12);
              g.line(-0.34, 0.31, -0.34, 0.42);   // Giudecca canal cuts
              g.line(-0.12, 0.31, -0.12, 0.43);
              g.line(0.04, -0.62, 0.32, -0.62);   // Murano Grand Canal
              g.rrect(0.14, 0.06, 0.09, 0.07, 0.01); // Piazza San Marco
            });
            // Ponte della Libertà causeway + Rialto, Accademia & Scalzi bridges
            g.accent(() => {
              g.line(-0.95, -0.22, -0.66, -0.14); // Ponte della Libertà
              g.line(-0.44, -0.18, -0.42, -0.12); // Ponte degli Scalzi
              g.line(-0.01, -0.10, 0.05, -0.06);  // Rialto Bridge
              g.line(-0.16, 0.12, -0.16, 0.20);   // Accademia Bridge
            });
          }
        }
      ]
    },
    {
      min: 160000,
      tier: 2,
      items: [
        {
          id: 'superspeedway_oval',
          label: 'Grand Prix Speedway',
          headline: 'Everyone left like you fits inside the grandstands and infield of one giant superspeedway.',
          sub: 'Roughly one Indy 500 race-day crowd.',
          draw(g) {
            // Outer wrap-around grandstand complex
            g.wash(() => g.rrect(0, 0, 1.88, 1.26, 0.50));
            // Banked rectangular-oval racing surface & inner apron
            g.contour(() => {
              g.rrect(0, 0, 1.60, 0.98, 0.36);
              g.rrect(0, 0, 1.40, 0.78, 0.28);
            });
            // Pit lane along frontstretch + timing pagoda & infield FIA Grand Prix road course
            g.sub(() => {
              g.poly([[-0.48, 0.39], [-0.42, 0.31], [0.42, 0.31], [0.48, 0.39]], false);
              g.rrect(-0.06, 0.27, 0.08, 0.06, 0.01); // Pagoda tower
              // Winding infield road circuit with hairpin & Esses
              g.smooth(
                [
                  [0.36, 0.31], [0.36, 0.08], [0.18, -0.22], [-0.08, -0.06],
                  [-0.28, -0.24], [-0.52, -0.10], [-0.46, 0.18], [-0.18, 0.14]
                ],
                false
              );
            });
            // Grandstand section dividers & infield lake
            g.inner(() => {
              for (let x = -0.52; x <= 0.53; x += 0.13) {
                g.line(x, 0.49, x, 0.63);
                g.line(x, -0.63, x, -0.49);
              }
              g.ellipse(0.38, -0.16, 0.13, 0.07, 0.25); // Infield lake
            });
            // Start / Finish "Yard of Bricks" line
            g.accent(() => g.line(-0.06, 0.39, -0.06, 0.51));
          }
        },
        {
          id: 'festival_valley',
          label: 'Music Festival Grounds',
          headline: 'Everyone matching your checklist fits across one Glastonbury-scale music festival valley.',
          sub: 'All camped out in front of the same pyramid main stage.',
          draw(g) {
            // Perimeter valley steel fence polygon
            g.wash(() =>
              g.poly(
                [
                  [-0.24, -0.88], [0.28, -0.88], [0.84, -0.34], [0.88, 0.32],
                  [0.54, 0.84], [-0.52, 0.84], [-0.88, 0.34], [-0.82, -0.38]
                ],
                true
              )
            );
            // Iconic Pyramid Main Stage + stage wings + backstage compound + FOH sound tower
            g.contour(() => {
              g.poly([[-0.22, -0.52], [0, -0.80], [0.22, -0.52]], true);
              g.line(0, -0.80, 0, -0.52);
              g.line(-0.36, -0.54, -0.22, -0.54);
              g.line(0.22, -0.54, 0.36, -0.54);
              g.rrect(0, -0.14, 0.14, 0.09, 0.01); // Front-of-house sound desk
            });
            // Secondary Other Stage & Acoustic Big Top domes
            g.sub(() => {
              g.rrect(-0.54, 0.32, 0.22, 0.10, 0.02); // Other Stage
              g.circle(0.52, 0.24, 0.13);             // Big Top tent
              g.spokes(0, 0, 0);                      // no-op
              g.radialTicks(0.52, 0.24, 0.03, 0.13, 8);
              g.circle(0.46, 0.56, 0.09);             // Park dome
            });
            // Concentric Golden Circle & delay-tower arcs + tent camping grid sectors
            g.inner(() => {
              g.concentricArcs(0, -0.56, 0.28, 0.18, 4, 0.48, Math.PI - 0.48);
              // Delay speaker towers
              g.rrect(-0.32, -0.18, 0.05, 0.05, 0.01);
              g.rrect(0.32, -0.18, 0.05, 0.05, 0.01);
              // Valley walkways
              g.smooth([[-0.76, -0.12], [-0.18, 0.18], [0.34, 0.38], [0.68, 0.52]], false);
              g.smooth([[0.76, -0.14], [0.22, 0.16], [-0.32, 0.52], [-0.48, 0.78]], false);
            });
            g.accent(() => g.arc(0, -0.56, 0.28, 0.52, Math.PI - 0.52));
          }
        },
        {
          id: 'fjord_island',
          label: 'Icelandic Fjord Island',
          headline: 'Everyone remaining on Earth could live comfortably across the fjords of Iceland.',
          sub: 'A sparse volcanic island’s worth of statistical twins.',
          draw(g) {
            drawCarto(g, 'fjord_island', {
              over(p) {
                // Vatnajökull, Langjökull & Hofsjökull ice-cap contours + Mid-Atlantic rift line
                p.inner(() => {
                  p.ellipse(0.34, 0.18, 0.20, 0.13, -0.15);
                  p.ellipse(-0.18, 0.04, 0.10, 0.06, -0.4);
                  p.ellipse(0.04, 0.04, 0.08, 0.07);
                });
                p.accent(() => p.smooth([[-0.56, 0.48], [-0.08, 0.18], [0.28, -0.16], [0.40, -0.54]], false), true);
              }
            });
          }
        }
      ]
    },
    {
      min: 60000,
      tier: 2,
      items: [
        {
          id: 'wembley_stadium',
          label: 'Olympic Stadium Bowl',
          headline: 'Everyone left like you fits inside one packed Olympic stadium bowl.',
          sub: 'Under 10,000 triggers 1-dot-equals-1-actual-human.',
          draw(g) {
            // Outer stadium roof canopy, middle concourse tier & inner roof oculus
            g.wash(() => g.superEllipse(0.96, 0.80, 2.45));
            g.contour(() => {
              g.superEllipse(0.80, 0.64, 2.5);
              g.superEllipse(0.60, 0.44, 2.6);
            });
            // Full FIFA soccer pitch markings
            g.sub(() => {
              g.rrect(0, 0, 0.90, 0.56, 0.01);
              g.line(0, -0.28, 0, 0.28);
              g.circle(0, 0, 0.10);
              // Left & right 18-yard penalty boxes + 6-yard boxes
              g.rrect(-0.37, 0, 0.16, 0.30, 0);
              g.rrect(0.37, 0, 0.16, 0.30, 0);
              g.rrect(-0.42, 0, 0.06, 0.14, 0);
              g.rrect(0.42, 0, 0.06, 0.14, 0);
            });
            // 32 radial roof trusses & seating bowl aisles
            g.inner(() => {
              for (let i = 0; i < 32; i++) {
                const t = (i / 32) * TAU;
                const ct = Math.cos(t);
                const st = Math.sin(t);
                const p = 2 / 2.5;
                const x0 = Math.sign(ct) * Math.pow(Math.abs(ct), p) * 0.60;
                const y0 = Math.sign(st) * Math.pow(Math.abs(st), p) * 0.44;
                const x1 = Math.sign(ct) * Math.pow(Math.abs(ct), p) * 0.96;
                const y1 = Math.sign(st) * Math.pow(Math.abs(st), p) * 0.80;
                g.line(x0, y0, x1, y1);
              }
            });
            // Signature twin-chord Wembley Arch spanning end-to-end overhead
            g.accent(() => {
              g.quad(-0.95, -0.10, 0, -0.96, 0.95, -0.10);
              g.quad(-0.95, -0.10, 0, -0.82, 0.95, -0.10);
            });
          }
        },
        {
          id: 'rose_bowl_stadium',
          label: 'College Football Bowl',
          headline: 'Everyone matching your checklist fits inside one sold-out college football bowl.',
          sub: 'From endzone to endzone, upper deck included.',
          draw(g) {
            // Classic elliptical stadium bowl + press box overhang on south rim
            g.wash(() => g.ellipse(0, 0, 0.96, 0.80));
            g.contour(() => {
              g.ellipse(0, 0, 0.82, 0.66);
              g.ellipse(0, 0, 0.60, 0.42);
              g.rrect(0, 0.75, 0.56, 0.11, 0.02); // Press box pavilion
            });
            // Full NCAA football gridiron: endzones, 10-yard lines, dual hash marks & goalposts
            g.sub(() => {
              g.rrect(0, 0, 0.90, 0.44, 0.01);
              g.line(-0.35, -0.22, -0.35, 0.22); // Left goal line
              g.line(0.35, -0.22, 0.35, 0.22);   // Right goal line
            });
            g.inner(() => {
              for (let x = -0.28; x <= 0.29; x += 0.07) {
                g.line(x, -0.22, x, 0.22);
              }
              g.line(-0.35, -0.06, 0.35, -0.06); // Hash marks
              g.line(-0.35, 0.06, 0.35, 0.06);
              // 28 radial tunnel vomitoria around the bowl
              for (let i = 0; i < 28; i++) {
                const a = (i / 28) * TAU;
                g.line(Math.cos(a) * 0.60, Math.sin(a) * 0.42, Math.cos(a) * 0.96, Math.sin(a) * 0.80);
              }
            });
            // Endzone goalposts
            g.accent(() => {
              g.line(-0.45, -0.07, -0.45, 0.07);
              g.line(0.45, -0.07, 0.45, 0.07);
            });
          }
        },
        {
          id: 'roman_colosseum',
          label: 'Roman Colosseum',
          headline: 'All of your remaining statistical lookalikes fit inside the Roman Colosseum.',
          sub: 'Every stone tier filled around the arena floor.',
          draw(g) {
            // Flavian Amphitheatre outer travertine wall + 3 concentric ambulatory rings + arena podium
            g.wash(() => g.ellipse(0, 0, 0.96, 0.80));
            g.contour(() => {
              g.ellipse(0, 0, 0.86, 0.70);
              g.ellipse(0, 0, 0.52, 0.37);
            });
            g.sub(() => {
              g.ellipse(0, 0, 0.74, 0.59);
              g.ellipse(0, 0, 0.63, 0.48);
              // 4 Cardinal Imperial & Gladiator Entrance Portals
              g.rrect(0, -0.74, 0.10, 0.44, 0);
              g.rrect(0, 0.74, 0.10, 0.44, 0);
              g.rrect(-0.74, 0, 0.44, 0.09, 0);
              g.rrect(0.74, 0, 0.44, 0.09, 0);
            });
            // 48 radial travertine vault walls + exposed subterranean Hypogeum masonry corridors!
            g.inner(() => {
              for (let i = 0; i < 48; i++) {
                const a = (i / 48) * TAU;
                g.line(Math.cos(a) * 0.52, Math.sin(a) * 0.37, Math.cos(a) * 0.96, Math.sin(a) * 0.80);
              }
              // Subterranean hypogeum parallel walls clipped cleanly inside ellipse (0.48, 0.33)
              for (let y = -0.26; y <= 0.27; y += 0.065) {
                const hx = 0.47 * Math.sqrt(Math.max(0, 1 - (y * y) / (0.33 * 0.33)));
                g.line(-hx, y, hx, y);
              }
            });
            g.accent(() => g.ellipse(0, 0, 0.52, 0.37));
          }
        }
      ]
    },
    {
      min: 28000,
      tier: 2,
      items: [
        {
          id: 'baseball_ballpark',
          label: 'Baseball Ballpark',
          headline: 'Everyone left like you fits inside the grandstands and bleachers of one baseball ballpark.',
          sub: 'One seventh-inning stretch of your statistical twins.',
          draw(g) {
            // Classic asymmetric MLB jewel-box ballpark perimeter
            g.wash(() =>
              g.poly(
                [
                  [0, 0.90], [-0.42, 0.78], [-0.84, 0.28], [-0.90, -0.34],
                  [-0.56, -0.82], [0.18, -0.88], [0.76, -0.62], [0.90, -0.12],
                  [0.78, 0.34], [0.42, 0.78]
                ],
                true
              )
            );
            // Multi-deck wrap-around grandstand behind home plate & outfield warning track
            g.contour(() => {
              g.poly(
                [
                  [0, 0.62], [-0.62, 0.02], [-0.66, -0.32], [-0.38, -0.66],
                  [0.16, -0.70], [0.58, -0.46], [0.66, -0.04]
                ],
                true
              );
              // Foul lines from home plate (0, 0.48) out to left & right foul poles
              g.line(0, 0.48, -0.62, -0.14);
              g.line(0, 0.48, 0.62, -0.14);
            });
            // Infield dirt arc, 90ft basepath grass diamond, pitcher's mound & bases
            g.sub(() => {
              g.arc(0, 0.22, 0.38, -Math.PI * 0.80, -Math.PI * 0.20);
              g.poly([[0, 0.48], [-0.24, 0.24], [0, 0.00], [0.24, 0.24]], true);
              g.circle(0, 0.25, 0.042); // Pitcher's mound
            });
            // Radial grandstand section aisles & outfield bleacher rows
            g.inner(() => {
              for (let i = 0; i <= 12; i++) {
                const a = Math.PI * 0.22 + (i / 12) * Math.PI * 0.56;
                g.line(Math.cos(a) * 0.42, -0.08 + Math.sin(a) * 0.68, Math.cos(a) * 0.78, -0.04 + Math.sin(a) * 0.90);
              }
              g.line(-0.56, -0.74, 0.14, -0.80); // Outfield bleachers
            });
            // Home plate circle & bases highlight
            g.accent(() => {
              g.circle(0, 0.48, 0.05);
              g.rrect(-0.24, 0.24, 0.035, 0.035, 0);
              g.rrect(0, 0.00, 0.035, 0.035, 0);
              g.rrect(0.24, 0.24, 0.035, 0.035, 0);
            });
          }
        },
        {
          id: 'cricket_oval',
          label: 'Cricket Oval Ground',
          headline: 'Everyone matching your profile fits around the boundary of one classic cricket oval.',
          sub: 'Under 10,000 unlocks individual 1-for-1 human dots.',
          draw(g) {
            // Grand oval cricket ground + ornate Members' Pavilion at south end
            g.wash(() => g.ellipse(0, 0, 0.90, 0.94));
            g.contour(() => {
              g.ellipse(0, 0, 0.70, 0.74); // Boundary rope
              g.rrect(0, 0.83, 0.44, 0.14, 0.03); // Victorian Members' Pavilion
            });
            // Dashed 30-yard fielding circle & central turf square of 5 pitches
            g.sub(() => g.ellipse(0, 0, 0.40, 0.44), true);
            g.sub(() => g.rrect(0, 0, 0.22, 0.34, 0.01));
            g.inner(() => {
              for (let x = -0.07; x <= 0.075; x += 0.035) {
                g.line(x, -0.16, x, 0.16);
              }
              // Radial seating bays & 6 perimeter floodlight stanchions
              for (let i = 0; i < 28; i++) {
                const a = (i / 28) * TAU;
                if (Math.sin(a) > 0.86) continue;
                g.line(Math.cos(a) * 0.70, Math.sin(a) * 0.74, Math.cos(a) * 0.90, Math.sin(a) * 0.94);
              }
              for (let i = 0; i < 6; i++) {
                const a = (i / 6) * TAU + 0.52;
                g.circle(Math.cos(a) * 0.93, Math.sin(a) * 0.96, 0.025);
              }
            });
            // Center match pitch & popping creases
            g.accent(() => {
              g.rrect(0, 0, 0.055, 0.30, 0);
              g.line(-0.05, -0.12, 0.05, -0.12);
              g.line(-0.05, 0.12, 0.05, 0.12);
            });
          }
        },
        {
          id: 'marathon_corral',
          label: 'City Marathon Start',
          headline: 'Everyone left like you equals the starting-corral field of one major city marathon.',
          sub: 'One more sharp trait brings every dot down to 1 actual person.',
          draw(g) {
            // Grand suspension-bridge / boulevard marathon start staging zone
            g.wash(() => g.rrect(0, 0, 1.04, 1.88, 0.10));
            // Twin carriageways with center median + suspension bridge towers & cable stays
            g.contour(() => {
              g.rrect(-0.22, 0, 0.38, 1.76, 0.03);
              g.rrect(0.22, 0, 0.38, 1.76, 0.03);
              // Twin bridge towers flanking start approach
              g.rrect(-0.58, -0.44, 0.12, 0.18, 0.02);
              g.rrect(0.58, -0.44, 0.12, 0.18, 0.02);
              g.line(-0.64, -0.44, 0.64, -0.44);
            });
            // Suspension cables & side medical/baggage tents
            g.sub(() => {
              g.quad(-0.50, -0.92, -0.56, -0.44, -0.50, 0.88);
              g.quad(0.50, -0.92, 0.56, -0.44, 0.50, 0.88);
              for (let y = 0.05; y <= 0.66; y += 0.20) {
                g.rrect(-0.62, y, 0.10, 0.12, 0.02);
                g.rrect(0.62, y, 0.10, 0.12, 0.02);
              }
            });
            // Wave Corrals A..E & timing mats + lead pace cars ahead of start
            g.inner(() => {
              for (let y = -0.22; y <= 0.72; y += 0.22) {
                g.line(-0.41, y, -0.03, y);
                g.line(0.03, y, 0.41, y);
              }
              g.rrect(-0.22, -0.76, 0.08, 0.13, 0.02); // Pace vehicle
              g.rrect(0.22, -0.76, 0.08, 0.13, 0.02);
            });
            // Prominent START gantry truss & timing line
            g.accent(() => {
              g.rrect(0, -0.58, 0.96, 0.07, 0.01);
              g.line(-0.46, -0.66, 0.46, -0.66);
            });
          }
        }
      ]
    },
    {
      min: 10000,
      tier: 2,
      items: [
        {
          id: 'round_arena',
          label: 'Circular Indoor Arena',
          headline: 'Everyone left like you fits inside one circular indoor arena.',
          sub: 'Right at the edge of the 10,000-person individual dot zoom.',
          draw(g) {
            // Madison Square Garden cable-net circular drum
            g.wash(() => g.circle(0, 0, 0.93));
            g.contour(() => {
              g.circle(0, 0, 0.78);
              g.circle(0, 0, 0.56);
            });
            // NBA / NHL arena floor: court boundary, center circle, 3-point arcs & keys
            g.sub(() => {
              g.rrect(0, 0, 0.76, 0.44, 0.02);
              g.line(0, -0.22, 0, 0.22);
              g.circle(0, 0, 0.085);
              g.rrect(-0.31, 0, 0.14, 0.15, 0);
              g.rrect(0.31, 0, 0.14, 0.15, 0);
              g.arc(-0.34, 0, 0.18, -Math.PI * 0.44, Math.PI * 0.44);
              g.arc(0.34, 0, 0.18, Math.PI * 0.56, Math.PI * 1.44);
            });
            // 32 radial structural cables & tiered seating bowl aisles
            g.inner(() => {
              g.spokes(0.56, 0.93, 32);
              g.circle(0, 0, 0.68);
            });
            g.accent(() => g.circle(0, 0, 0.14));
          }
        },
        {
          id: 'canyon_amphitheater',
          label: 'Canyon Amphitheater',
          headline: 'Everyone matching your checklist fits on the stone benches of one canyon amphitheater.',
          sub: 'Carved between twin rock monoliths — almost under 10,000.',
          draw(g) {
            // Red Rocks stone amphitheater flanked by sculpted Creation Rock & Ship Rock monoliths!
            g.wash(() =>
              g.poly(
                [
                  [-0.30, 0.74], [-0.74, -0.66], [0.74, -0.66], [0.30, 0.74]
                ],
                true
              )
            );
            // Twin towering sandstone monoliths (with topographic elevation contours!)
            g.contour(() => {
              g.smooth(
                [
                  [-0.95, -0.44], [-0.88, -0.74], [-0.68, -0.70],
                  [-0.30, 0.68], [-0.46, 0.80], [-0.74, 0.36]
                ],
                true
              );
              g.smooth(
                [
                  [0.95, -0.44], [0.88, -0.74], [0.68, -0.70],
                  [0.30, 0.68], [0.46, 0.80], [0.74, 0.36]
                ],
                true
              );
              // Stage house & Stage Rock outcrop behind it
              g.rrect(0, 0.68, 0.48, 0.13, 0.03);
              g.smooth([[-0.26, 0.78], [0, 0.92], [0.26, 0.78]], false);
            });
            // Upper Visitors' Plaza terrace & side stepped ramps
            g.sub(() => {
              g.rrect(0, -0.73, 1.24, 0.12, 0.03);
              g.line(-0.26, 0.62, -0.66, -0.64);
              g.line(0.26, 0.62, 0.66, -0.64);
            });
            // 11 concentric curved stone bench rows + sandstone elevation contours
            g.inner(() => {
              for (let r = 0.26; r <= 1.32; r += 0.105) {
                const halfAng = Math.min(0.29, 0.25 + r * 0.035);
                g.arc(0, 0.74, r, -Math.PI * 0.5 - halfAng, -Math.PI * 0.5 + halfAng);
              }
              g.smooth([[-0.82, -0.52], [-0.64, 0.02], [-0.48, 0.56]], false);
              g.smooth([[0.82, -0.52], [0.64, 0.02], [0.48, 0.56]], false);
            });
            g.accent(() => g.arc(0, 0.74, 0.20, -Math.PI * 0.78, -Math.PI * 0.22));
          }
        },
        {
          id: 'velodrome_track',
          label: 'Olympic Velodrome',
          headline: 'Everyone remaining fits around the banked timber oval of an indoor velodrome.',
          sub: 'Less than 0.0003% of Earth still matches.',
          draw(g) {
            // Pringle-curved saddle roof oval + spectator tier + 250m banked Siberian-pine track
            g.wash(() => g.rrect(0, 0, 1.86, 1.34, 0.62));
            g.contour(() => {
              g.rrect(0, 0, 1.54, 1.02, 0.48); // Track outer balustrade
              g.rrect(0, 0, 1.12, 0.60, 0.28); // Track inner Côte d'Azur apron
            });
            // Sprinter's lane, stayer's line & infield warm-up ring
            g.sub(() => {
              g.rrect(0, 0, 1.38, 0.86, 0.40);
              g.rrect(0, 0, 1.24, 0.72, 0.34);
              g.rrect(0, 0, 0.88, 0.36, 0.16);
            });
            // Tension cable-net roof grid & radial seating aisles
            g.inner(() => {
              for (let x = -0.44; x <= 0.45; x += 0.22) {
                g.line(x, -0.66, x, -0.51);
                g.line(x, 0.51, x, 0.66);
              }
              g.line(-0.56, 0, 0.56, 0);
              g.rrect(0.24, 0, 0.18, 0.12, 0.02); // Riders' access ramp
            });
            // Pursuit lines (center) & Finish line
            g.accent(() => {
              g.line(0, -0.51, 0, -0.30);
              g.line(0, 0.30, 0, 0.51);
              g.line(0.18, 0.30, 0.18, 0.51);
            });
          }
        }
      ]
    },

    // --- TIER 3 · STADIUM / VENUE (250 .. 9,999) ---
    {
      min: 4000,
      tier: 3,
      items: [
        {
          id: 'cruise_liner',
          label: 'Ocean Cruise Ship',
          headline: 'Every dot is now 1 actual human — and all of you fit aboard one ocean cruise ship.',
          sub: 'Every promenade deck and poolside lounge chair accounted for.',
          draw(g) {
            // Hydrodynamic ocean liner hull
            g.wash(() =>
              g.sym(
                [
                  [0, -0.96], [0.16, -0.78], [0.34, -0.46], [0.38, -0.12],
                  [0.38, 0.58], [0.34, 0.84], [0.20, 0.92], [0, 0.93]
                ],
                true
              )
            );
            // Flared navigation bridge wings & stepped balcony superstructure
            g.contour(() => {
              g.sym(
                [
                  [0, -0.58], [0.46, -0.56], [0.46, -0.48], [0.30, -0.46],
                  [0.31, 0.68], [0.24, 0.82], [0, 0.84]
                ],
                false
              );
              // Swept exhaust funnel casing aft
              g.ellipse(0, 0.46, 0.10, 0.18);
            });
            // 12 outboard lifeboats (6 port, 6 starboard), foredeck helipad & twin resort pools
            g.sub(() => {
              g.circle(0, -0.74, 0.085); // Bow helipad
              g.rrect(0, -0.20, 0.16, 0.24, 0.04); // Main Lido pool
              g.rrect(0, 0.14, 0.16, 0.20, 0.04);  // Midship pool
              for (let y = -0.32; y <= 0.44; y += 0.15) {
                g.rrect(-0.35, y, 0.055, 0.11, 0.02);
                g.rrect(0.35, y, 0.055, 0.11, 0.02);
              }
            });
            // Whirlpools, foredeck anchor windlass, funnel louvers & stern wake V-waves
            g.inner(() => {
              g.circle(-0.13, -0.04, 0.03);
              g.circle(0.13, -0.04, 0.03);
              g.line(0, -0.94, 0, -0.84);
              for (let y = 0.38; y <= 0.54; y += 0.05) g.line(-0.06, y, 0.06, y);
              g.line(-0.24, 0.92, -0.52, 0.99);
              g.line(0.24, 0.92, 0.52, 0.99);
            });
            g.accent(() => {
              g.line(-0.04, -0.77, -0.04, -0.71);
              g.line(0.04, -0.77, 0.04, -0.71);
              g.line(-0.04, -0.74, 0.04, -0.74); // Helipad 'H'
            });
          }
        },
        {
          id: 'albert_rotunda',
          label: 'Domed Concert Rotunda',
          headline: 'Every dot is 1 actual human — and everyone left fits inside one domed concert rotunda.',
          sub: 'From the standing arena floor up to the top gallery ring.',
          draw(g) {
            // Royal Albert Hall 4 cardinal entrance porticoes + elliptical terracotta drum
            g.sub(() => {
              g.rrect(0, -0.91, 0.26, 0.12, 0.02);
              g.rrect(0, 0.91, 0.26, 0.12, 0.02);
              g.rrect(-0.87, 0, 0.12, 0.24, 0.02);
              g.rrect(0.87, 0, 0.12, 0.24, 0.02);
            });
            g.wash(() => g.ellipse(0, 0, 0.85, 0.90));
            // Outer gallery wall, Grand Tier box ring, & Proms central arena
            g.contour(() => {
              g.ellipse(0, 0.02, 0.72, 0.77);
              g.ellipse(0, 0.04, 0.56, 0.60);
              // Grand Pipe Organ recess & curved orchestra stage at north end
              g.arc(0, -0.54, 0.22, Math.PI, TAU);
              g.quad(-0.34, -0.36, 0, -0.22, 0.34, -0.36);
            });
            // Central flat Proms arena & orchestra risers
            g.sub(() => {
              g.ellipse(0, 0.12, 0.34, 0.38);
              g.concentricArcs(0, -0.52, 0.14, 0.07, 3, 0.22, Math.PI - 0.22);
            });
            // 28 radial private loggia box partitions + overhead acoustic "mushroom" diffuser circles
            g.inner(() => {
              for (let i = 0; i < 28; i++) {
                const a = (i / 28) * TAU;
                if (Math.sin(a) < -0.82) continue; // skip organ apse
                g.line(Math.cos(a) * 0.56, 0.04 + Math.sin(a) * 0.60, Math.cos(a) * 0.72, 0.02 + Math.sin(a) * 0.77);
              }
              for (let i = 0; i < 8; i++) {
                const a = (i / 8) * TAU;
                g.circle(Math.cos(a) * 0.20, 0.12 + Math.sin(a) * 0.22, 0.042);
              }
            });
            // Organ pipe ranks & conductor's podium
            g.accent(() => {
              g.circle(0, -0.28, 0.032);
              for (let x = -0.14; x <= 0.141; x += 0.046) {
                g.line(x, -0.72, x, -0.58);
              }
            });
          }
        },
        {
          id: 'aircraft_carrier',
          label: 'Aircraft Carrier Deck',
          headline: 'Every dot is 1 human — and your entire remaining crowd equals the crew of one aircraft carrier.',
          sub: 'Mustering shoulder-to-shoulder across the angled flight deck.',
          draw(g) {
            // Stern propeller wake & lower hull waterline dashed contour
            g.fine(() => {
              g.line(-0.18, 0.90, -0.34, 0.99);
              g.line(0.18, 0.90, 0.34, 0.99);
              g.sym([[0, -0.92], [0.22, -0.52], [0.26, 0.56], [0.18, 0.88], [0, 0.90]], true);
            });
            // 4 Deck-edge aircraft elevators (3 starboard, 1 port aft) + port sponsor
            g.sub(() => {
              g.rrect(0.44, -0.26, 0.13, 0.18, 0.01); // Starboard Elevator 1
              g.rrect(0.46, 0.34, 0.13, 0.18, 0.01);  // Starboard Elevator 2
              g.rrect(0.42, 0.62, 0.13, 0.17, 0.01);  // Starboard Elevator 3
              g.rrect(-0.48, 0.38, 0.13, 0.18, 0.01); // Port Elevator 4
            });
            // Nimitz / Ford-class supercarrier angled flight deck
            g.wash(() =>
              g.poly(
                [
                  [-0.20, -0.94], [0.22, -0.94], [0.39, -0.44], [0.41, 0.54],
                  [0.30, 0.90], [-0.28, 0.90], [-0.41, 0.48], [-0.58, 0.14],
                  [-0.54, -0.08], [-0.30, -0.52]
                ],
                true
              )
            );
            // Starboard Island superstructure + radar mast & angled landing runway boundaries
            g.contour(() => {
              g.poly([[0.25, -0.08], [0.39, -0.08], [0.39, 0.24], [0.28, 0.26], [0.25, 0.18]], true);
              g.circle(0.32, 0.04, 0.036);
              g.line(0.22, 0.04, 0.43, 0.04); // Radar yardarm
              // Angled landing runway sidelines & threshold
              g.line(0.02, 0.88, -0.34, -0.10);
              g.line(-0.24, 0.88, -0.56, 0.00);
            });
            // 4 Steam/EMALS catapult tracks, jet blast deflectors, 4 arresting wires & parked fighter squadron!
            g.inner(() => {
              g.line(-0.10, -0.91, -0.08, -0.24); // Bow Cat 1
              g.line(0.12, -0.91, 0.10, -0.24);   // Bow Cat 2
              g.rrect(-0.08, -0.22, 0.08, 0.03, 0); // JBD 1
              g.rrect(0.10, -0.22, 0.08, 0.03, 0);  // JBD 2
              g.line(-0.46, -0.04, -0.22, 0.42);  // Waist Cat 3
              g.line(-0.52, 0.08, -0.30, 0.50);   // Waist Cat 4
              // 4 Arresting gear cross-wires aft
              for (let t = 0; t < 4; t++) {
                const y = 0.60 + t * 0.065;
                g.line(-0.23 + t * 0.022, y, -0.01 + t * 0.022, y - 0.07);
              }
              // 4 Swept-wing F/A-18 fighter silhouettes parked along starboard bow
              for (let k = 0; k < 4; k++) {
                const jy = -0.66 + k * 0.14;
                g.poly([[0.20, jy], [0.34, jy - 0.045], [0.36, jy], [0.34, jy + 0.045]], true);
              }
            });
            // Angled landing centerline & port Optical Landing System ("Meatball")
            g.accent(() => {
              g.line(-0.11, 0.88, -0.45, -0.05);
              g.rrect(-0.46, 0.24, 0.05, 0.04, 0);
            }, true);
          }
        },
        {
          id: 'grand_concourse',
          label: 'Grand Train Terminal',
          headline: 'Every dot is 1 actual human — enough to fill the main concourse of a grand train terminal.',
          sub: 'Gathered around the center information clock.',
          draw(g) {
            // Grand Central Terminal: departure track shed (north) + Main Concourse + 42nd St Beaux-Arts facade (south)
            g.sub(() => {
              // 12 parallel northern departure tracks & platforms
              g.rrect(0, -0.68, 1.52, 0.44, 0.02);
              for (let x = -0.66; x <= 0.67; x += 0.12) {
                g.line(x, -0.89, x, -0.46);
              }
            });
            g.wash(() => g.rrect(0, 0.08, 1.78, 1.12, 0.05));
            // Thick Beaux-Arts masonry wall, East & West grand marble staircases & Vanderbilt Hall foyer
            g.contour(() => {
              g.rrect(0, 0.04, 1.56, 0.82, 0.02);
              // West & East grand dual staircases
              g.poly([[-0.78, -0.14], [-0.58, -0.08], [-0.58, 0.16], [-0.78, 0.22]], true);
              g.poly([[0.78, -0.14], [0.58, -0.08], [0.58, 0.16], [0.78, 0.22]], true);
              // South ticket arcade & 3 monumental street portals
              g.rrect(0, 0.55, 1.24, 0.16, 0.02);
            });
            // Stair treads, ticket windows, track gate portals & structural wall pilasters
            g.inner(() => {
              for (let x = -0.60; x <= 0.61; x += 0.20) {
                g.rrect(x, -0.40, 0.09, 0.06, 0.01); // Track gate portals
                g.line(x, 0.45, x, 0.50);            // Ticket windows
              }
              for (let y = -0.06; y <= 0.15; y += 0.05) {
                g.line(-0.76, y, -0.60, y);
                g.line(0.60, y, 0.76, y);
              }
              // 3 arched 42nd St entrance vestibules
              g.rrect(-0.36, 0.64, 0.18, 0.06, 0.01);
              g.rrect(0, 0.64, 0.18, 0.06, 0.01);
              g.rrect(0.36, 0.64, 0.18, 0.06, 0.01);
            });
            // Iconic center 4-faced brass Information Booth & Clock!
            g.accent(() => {
              g.circle(0, 0.04, 0.13);
              g.circle(0, 0.04, 0.055);
              g.radialTicks(0, 0.04, 0.06, 0.13, 4);
            });
          }
        }
      ]
    },
    {
      min: 1600,
      tier: 3,
      items: [
        {
          id: 'opera_shells',
          label: 'Harbor Opera House',
          headline: 'Everyone left like you fits beneath the vaulted shells of a harbor opera house.',
          sub: 'One evening performance of remarkably similar biographies.',
          draw(g) {
            // Sydney Harbour water contours wrapping Bennelong Point peninsula
            g.fine(() => {
              g.arc(0, 0.08, 0.94, -Math.PI * 0.94, Math.PI * 0.04);
              g.arc(0, 0.08, 0.88, -Math.PI * 0.89, -Math.PI * 0.02);
            });
            // Stepped granite Bennelong Point harbor podium & monumental forecourt stairs!
            g.wash(() =>
              g.poly(
                [
                  [-0.66, 0.86], [-0.70, 0.30], [-0.66, -0.36], [-0.46, -0.78],
                  [-0.08, -0.82], [-0.02, -0.64], [0.16, -0.68], [0.54, -0.60],
                  [0.70, -0.18], [0.64, 0.40], [0.56, 0.86]
                ],
                true
              )
            );
            // Jørn Utzon's authentic architectural roof plan: twin angled chevron-ribbed spherical shell spines!
            const drawUtzonSpine = (cx0, cy0, rot, scale, tiers) => {
              const cr = Math.cos(rot);
              const sr = Math.sin(rot);
              const tp = (lx, ly) => [cx0 + (lx * cr - ly * sr) * scale, cy0 + (lx * sr + ly * cr) * scale];
              for (let i = 0; i < tiers.length; i++) {
                const [yApex, yBase, halfW] = tiers[i];
                const apex = tp(0, yApex);
                const leftF = tp(-halfW, yBase);
                const rightF = tp(halfW, yBase);
                const midL = tp(-halfW * 0.62, (yApex + yBase) * 0.5 - 0.04);
                const midR = tp(halfW * 0.62, (yApex + yBase) * 0.5 - 0.04);
                const valley = tp(0, yBase - 0.07);
                // Sculpted gothic-arch spherical shell pair
                g.tint(() => {
                  g.poly([apex, midL, leftF, valley, rightF, midR], true);
                }, 0.85);
                g.contour(() => {
                  g.quad(leftF[0], leftF[1], midL[0], midL[1], apex[0], apex[1]);
                  g.quad(rightF[0], rightF[1], midR[0], midR[1], apex[0], apex[1]);
                  g.quad(leftF[0], leftF[1], valley[0], valley[1], rightF[0], rightF[1]);
                });
                // Precast concrete spherical tile rib fans radiating from footings to ridge!
                g.inner(() => {
                  for (let r = 1; r <= 3; r++) {
                    const f = r / 4;
                    const rxL = tp(-halfW * (1 - f * 0.2), yBase - f * 0.05);
                    const rxR = tp(halfW * (1 - f * 0.2), yBase - f * 0.05);
                    const spPt = tp(0, yApex + (yBase - 0.07 - yApex) * f);
                    g.line(rxL[0], rxL[1], spPt[0], spPt[1]);
                    g.line(rxR[0], rxR[1], spPt[0], spPt[1]);
                  }
                });
              }
              const topP = tp(0, tiers[0][0]);
              const botP = tp(0, tiers[tiers.length - 1][1] - 0.06);
              g.accent(() => g.line(topP[0], topP[1], botP[0], botP[1]));
            };
            // Concert Hall Spine (4 graduated vaulted shell pairs on west podium)
            drawUtzonSpine(-0.26, -0.16, -0.07, 1.0, [
              [-0.58, -0.26, 0.24],
              [-0.38, -0.02, 0.29],
              [-0.14, 0.22, 0.27],
              [0.10, 0.40, 0.21]
            ]);
            // Joan Sutherland Opera Theatre Spine (4 graduated vaulted shell pairs on east podium)
            drawUtzonSpine(0.32, -0.04, 0.09, 0.88, [
              [-0.54, -0.22, 0.23],
              [-0.34, 0.02, 0.27],
              [-0.10, 0.24, 0.25],
              [0.12, 0.42, 0.19]
            ]);
            // Bennelong Restaurant smaller twin shell (SW corner) & wide ceremonial forecourt steps!
            g.contour(() => {
              g.quad(-0.62, 0.46, -0.50, 0.28, -0.38, 0.48);
              g.line(-0.62, 0.46, -0.38, 0.48);
            });
            g.inner(() => {
              for (let y = 0.48; y <= 0.80; y += 0.065) {
                g.line(-0.58, y, 0.50, y);
              }
            });
          }
        },
        {
          id: 'gothic_cathedral',
          label: 'Cathedral Floorplan',
          headline: 'Everyone matching your checklist fits inside the nave and transepts of one Gothic cathedral.',
          sub: 'Every single dot on the blueprint is one living human.',
          draw(g) {
            // Exterior flying-buttress piers flanking nave & chevet chapels
            g.sub(() => {
              for (let y = 0.18; y <= 0.68; y += 0.16) {
                g.rrect(-0.37, y, 0.08, 0.04, 0);
                g.rrect(0.37, y, 0.08, 0.04, 0);
              }
              // 5 Radiating Chevet Chapels around the northern apse!
              for (let i = 0; i < 5; i++) {
                const a = -Math.PI + 0.32 + (i / 4) * (Math.PI - 0.64);
                g.circle(Math.cos(a) * 0.33, -0.58 + Math.sin(a) * 0.30, 0.075);
              }
            });
            // Cruciform Gothic Cathedral masonry footprint
            g.wash(() =>
              g.sym(
                [
                  [0, -0.88], [0.22, -0.82], [0.32, -0.60], [0.32, -0.26],
                  [0.76, -0.26], [0.76, 0.10], [0.32, 0.10], [0.32, 0.88],
                  [0.14, 0.88], [0.10, 0.84], [0, 0.84]
                ],
                false
              )
            );
            // Twin western bell towers (bottom), crossing lantern & semicircular choir apse
            g.contour(() => {
              g.rrect(-0.23, 0.77, 0.18, 0.20, 0.01);
              g.rrect(0.23, 0.77, 0.18, 0.20, 0.01);
              g.rrect(0, -0.08, 0.32, 0.32, 0.01);
              g.arc(0, -0.56, 0.18, Math.PI, TAU);
            });
            // Nave colonnade piers & diagonal quadripartite groin-vault ribs in every bay!
            g.inner(() => {
              const bayY = [-0.56, -0.40, -0.24, 0.08, 0.24, 0.40, 0.56, 0.68];
              for (let i = 0; i < bayY.length; i++) {
                const y = bayY[i];
                g.line(-0.32, y, 0.32, y);
                g.circle(-0.16, y, 0.018);
                g.circle(0.16, y, 0.018);
                if (i < bayY.length - 1 && !(y === -0.24)) {
                  const yn = bayY[i + 1];
                  g.line(-0.16, y, 0.16, yn);
                  g.line(0.16, y, -0.16, yn);
                }
              }
              g.line(-0.16, -0.56, -0.16, 0.68);
              g.line(0.16, -0.56, 0.16, 0.68);
              // Transept vault bays
              g.line(-0.54, -0.26, -0.54, 0.10);
              g.line(0.54, -0.26, 0.54, 0.10);
              g.line(-0.76, -0.08, 0.76, -0.08);
              // Crossing X-vault
              g.line(-0.16, -0.24, 0.16, 0.08);
              g.line(0.16, -0.24, -0.16, 0.08);
            });
            // High Altar & Crossing Rose Medallion
            g.accent(() => {
              g.rrect(0, -0.52, 0.12, 0.07, 0.01);
              g.circle(0, -0.08, 0.085);
            });
          }
        },
        {
          id: 'campus_quad',
          label: 'High School Campus Quad',
          headline: 'Everyone remaining on Earth equals one suburban high school quadrangle.',
          sub: 'One hyper-specific hobby or quirk could clear the courtyard.',
          draw(g) {
            // Landscaped campus lawn base + 4 surrounding academic pavilion buildings!
            g.tint(() => g.rrect(0, 0, 1.76, 1.76, 0.08), 0.55);
            g.wash(() => {
              // North Main Library with projecting portico & rotunda
              g.poly(
                [
                  [-0.64, -0.88], [0.64, -0.88], [0.64, -0.58], [0.20, -0.58],
                  [0.20, -0.50], [-0.20, -0.50], [-0.20, -0.58], [-0.64, -0.58]
                ],
                true
              );
              // West & East Classroom Wings
              g.rrect(-0.73, 0.04, 0.28, 1.04, 0.02);
              g.rrect(0.73, 0.04, 0.28, 1.04, 0.02);
              // South Gatehouse & Clock Arcade (split by central archway)
              g.rrect(-0.38, 0.74, 0.48, 0.24, 0.02);
              g.rrect(0.38, 0.74, 0.48, 0.24, 0.02);
            });
            // Library dome & courtyard fountain basin
            g.contour(() => {
              g.circle(0, -0.72, 0.12);
              g.circle(0, 0.04, 0.15);
            });
            // Paved brick courtyard walkways (axial + diagonal) & classroom roof ridges
            g.inner(() => {
              g.line(0, -0.50, 0, -0.11);
              g.line(0, 0.19, 0, 0.86);
              g.line(-0.59, 0.04, -0.15, 0.04);
              g.line(0.15, 0.04, 0.59, 0.04);
              g.line(-0.58, -0.48, -0.11, -0.07);
              g.line(0.58, -0.48, 0.11, -0.07);
              g.line(-0.58, 0.56, -0.11, 0.15);
              g.line(0.58, 0.56, 0.11, 0.15);
              // Shade tree crowns along the quad lawn
              const trees = [[-0.36, -0.34], [0.36, -0.34], [-0.36, 0.42], [0.36, 0.42]];
              for (let i = 0; i < trees.length; i++) {
                g.scallopRing(trees[i][0], trees[i][1], 0.075, 0.075, 7, 0.18, true);
              }
              g.line(-0.73, -0.46, -0.73, 0.54);
              g.line(0.73, -0.46, 0.73, 0.54);
            });
            g.accent(() => g.circle(0, 0.04, 0.055));
          }
        }
      ]
    },
    {
      min: 700,
      tier: 3,
      items: [
        {
          id: 'broadway_theater',
          label: 'Broadway Theater',
          headline: 'Everyone left like you fits inside the orchestra and balcony of a historic Broadway theater.',
          sub: 'You could make eye contact with all of them before intermission.',
          draw(g) {
            // Beaux-Arts Broadway playhouse: fly-tower stagehouse + fanned auditorium + grand lobby
            g.wash(() =>
              g.sym(
                [
                  [0, -0.90], [0.64, -0.90], [0.64, -0.44], [0.56, -0.44],
                  [0.80, -0.06], [0.82, 0.42], [0.64, 0.72], [0.54, 0.90], [0, 0.90]
                ],
                false
              )
            );
            // Proscenium wall, curved stage apron, sunken orchestra pit & balcony overhang rails
            g.contour(() => {
              g.line(-0.64, -0.44, -0.44, -0.44);
              g.line(0.44, -0.44, 0.64, -0.44);
              g.quad(-0.44, -0.44, 0, -0.30, 0.44, -0.44); // Stage apron
              g.quad(-0.40, -0.36, 0, -0.22, 0.40, -0.36); // Orchestra pit rail
              // Cantilevered Mezzanine & Dress Circle front curves
              g.quad(-0.76, 0.18, 0, 0.36, 0.76, 0.18);
              g.quad(-0.70, 0.44, 0, 0.58, 0.70, 0.44);
              // Lobby foyer wall at bottom
              g.line(-0.58, 0.72, 0.58, 0.72);
            });
            // Side opera boxes, backstage wing curtains & twin radial orchestra aisles
            g.sub(() => {
              g.rrect(-0.60, -0.22, 0.12, 0.24, 0.03);
              g.rrect(0.60, -0.22, 0.12, 0.24, 0.03);
              g.line(-0.14, -0.24, -0.28, 0.66);
              g.line(0.14, -0.24, 0.28, 0.66);
              g.rrect(0, 0.66, 0.22, 0.08, 0.01); // Sound & light booth
            });
            // 8 curved rows of orchestra & balcony seats + backstage fly-lines + lobby columns
            g.inner(() => {
              for (let r = 0.40; r <= 1.12; r += 0.10) {
                const span = Math.min(0.46, 0.54 / r);
                g.arc(0, -0.58, r, Math.PI * 0.5 - span, Math.PI * 0.5 + span);
              }
              for (let y = -0.80; y <= -0.54; y += 0.09) {
                g.line(-0.50, y, 0.50, y);
              }
              for (let x = -0.36; x <= 0.37; x += 0.18) {
                g.circle(x, 0.81, 0.024);
              }
            });
            // Warm-brass proscenium footlights & conductor podium
            g.accent(() => {
              g.quad(-0.44, -0.44, 0, -0.30, 0.44, -0.44);
              g.circle(0, -0.30, 0.028);
            });
          }
        },
        {
          id: 'vineyard_symphony',
          label: 'Symphony Concert Hall',
          headline: 'Everyone matching your profile fits on the terraced tiers of one symphony concert hall.',
          sub: 'Surrounding the center stage with barely a spare seat.',
          draw(g) {
            // Berlin Philharmonie / Disney Hall sculptural faceted-and-curved acoustic shell!
            g.wash(() =>
              g.sym(
                [
                  [0, -0.94], [0.46, -0.84], [0.86, -0.46], [0.92, 0.08],
                  [0.78, 0.62], [0.38, 0.90], [0, 0.94]
                ],
                false
              )
            );
            // Inner acoustic hall perimeter wall (revealing surrounding promenade foyer)
            g.sub(() =>
              g.sym(
                [
                  [0, -0.84], [0.40, -0.75], [0.76, -0.40], [0.82, 0.06],
                  [0.68, 0.54], [0.32, 0.80], [0, 0.84]
                ],
                false
              )
            );
            // Central Orchestra Stage + Grand Pipe Organ Casing behind stage
            g.tint(() =>
              g.poly(
                [
                  [-0.26, -0.26], [0.26, -0.26], [0.32, 0.04],
                  [0, 0.12], [-0.32, 0.04]
                ],
                true
              ),
              1.4,
              true
            );
            g.contour(() => {
              // Orchestra stage platform
              g.poly(
                [
                  [-0.26, -0.26], [0.26, -0.26], [0.32, 0.04],
                  [0, 0.12], [-0.32, 0.04]
                ],
                true
              );
              // Stepped Pipe Organ casework behind orchestra
              g.poly(
                [
                  [-0.22, -0.28], [-0.24, -0.40], [-0.10, -0.43], [0, -0.39],
                  [0.10, -0.43], [0.24, -0.40], [0.22, -0.28]
                ],
                true
              );
              // 7 Interlocking Vineyard Seating Terrace Parapet Blocks wrapping 360 deg!
              // 1. Rear Choir Loft Terrace
              g.poly([[-0.32, -0.74], [0.32, -0.74], [0.24, -0.46], [-0.24, -0.46]], true);
              // 2 & 3. Upper-Left & Upper-Right Angled Vineyard Terraces
              g.poly([[-0.38, -0.70], [-0.70, -0.38], [-0.52, -0.24], [-0.30, -0.44]], true);
              g.poly([[0.38, -0.70], [0.70, -0.38], [0.52, -0.24], [0.30, -0.44]], true);
              // 4 & 5. Left & Right Cantilevered Side Vineyard Terraces
              g.poly([[-0.38, -0.18], [-0.74, -0.26], [-0.76, 0.26], [-0.42, 0.20]], true);
              g.poly([[0.38, -0.18], [0.74, -0.26], [0.76, 0.26], [0.42, 0.20]], true);
              // 6. Main Front Parterre Vineyard Block
              g.poly([[-0.36, 0.18], [0, 0.23], [0.36, 0.18], [0.48, 0.50], [0, 0.56], [-0.48, 0.50]], true);
              // 7. High Rear Gallery Vineyard Block
              g.poly([[-0.56, 0.56], [0, 0.63], [0.56, 0.56], [0.32, 0.78], [-0.32, 0.78]], true);
            });
            // Crisp parallel seating rows inside EVERY vineyard terrace + ensemble risers on stage!
            g.inner(() => {
              // Orchestra musician semicircle risers
              g.concentricArcs(0, 0.04, 0.10, 0.075, 3, -Math.PI * 0.92, -Math.PI * 0.08);
              // Choir rows
              for (let y = -0.68; y <= -0.51; y += 0.055) {
                const hw = 0.24 + ((-0.46 - y) / 0.28) * 0.07;
                g.line(-hw, y, hw, y);
              }
              // Upper-left & upper-right angled rows
              for (let k = 1; k <= 3; k++) {
                const t = k / 4;
                g.line(-0.30 - t * 0.08, -0.44 - t * 0.24, -0.52 - t * 0.17, -0.24 - t * 0.14);
                g.line(0.30 + t * 0.08, -0.44 - t * 0.24, 0.52 + t * 0.17, -0.24 - t * 0.14);
              }
              // Left & right side vineyard rows
              for (let k = 1; k <= 5; k++) {
                const x = 0.42 + k * 0.055;
                g.line(-x, -0.19 - k * 0.01, -x - 0.02, 0.19 + k * 0.01);
                g.line(x, -0.19 - k * 0.01, x + 0.02, 0.19 + k * 0.01);
              }
              // Front Parterre chevron rows + center aisle
              g.line(0, 0.23, 0, 0.56);
              for (let k = 1; k <= 5; k++) {
                const t = k / 6;
                const yMid = 0.23 + t * 0.32;
                const yEdge = 0.18 + t * 0.32;
                const hw = 0.36 + t * 0.11;
                g.line(-hw, yEdge, 0, yMid);
                g.line(0, yMid, hw, yEdge);
              }
              // Rear High Gallery rows
              for (let k = 1; k <= 3; k++) {
                const t = k / 4;
                const yMid = 0.63 + t * 0.15;
                const yEdge = 0.56 + t * 0.21;
                const hw = 0.56 - t * 0.22;
                g.line(-hw, yEdge, 0, yMid);
                g.line(0, yMid, hw, yEdge);
              }
            });
            // Conductor's rostrum, concert grand piano & pipe-organ pipes in warm brass
            g.accent(() => {
              g.circle(0, 0.05, 0.032); // Conductor's podium
              g.poly([[-0.16, -0.02], [-0.09, -0.02], [-0.09, 0.04], [-0.14, 0.06]], true); // Grand piano
              for (let x = -0.18; x <= 0.185; x += 0.045) {
                g.line(x, -0.39, x, -0.29);
              }
            });
          }
        },
        {
          id: 'three_ring_tent',
          label: 'Three-Ring Big Top',
          headline: 'Everyone left like you fits beneath the canvas canopy of one three-ring circus tent.',
          sub: 'Around a thousand people out of 8.3 billion.',
          draw(g) {
            // Exterior guy-rope lines & stakes around scalloped Big Top canvas canopy
            g.fine(() => {
              for (let i = 0; i < 18; i++) {
                const a = (i / 18) * TAU;
                g.line(Math.cos(a) * 0.86, Math.sin(a) * 0.68, Math.cos(a) * 0.96, Math.sin(a) * 0.77);
                g.circle(Math.cos(a) * 0.96, Math.sin(a) * 0.77, 0.012);
              }
            });
            g.wash(() => g.scallopRing(0, 0, 0.86, 0.68, 18, 0.045, true));
            // Performers' marquee entrance tent (left) & oval hippodrome parade track
            g.contour(() => {
              g.rrect(-0.88, 0, 0.14, 0.22, 0.02);
              g.rrect(0, 0, 1.38, 0.72, 0.36);
              // Three performance rings!
              g.circle(-0.42, 0, 0.18);
              g.circle(0, 0, 0.21);
              g.circle(0.42, 0, 0.18);
            });
            // North & South tiered wooden bleacher banks + 4 king-pole masts
            g.sub(() => {
              g.rrect(0, -0.49, 0.96, 0.18, 0.03);
              g.rrect(0, 0.49, 0.96, 0.18, 0.03);
              g.circle(-0.22, 0, 0.024);
              g.circle(0.22, 0, 0.024);
              g.circle(-0.62, 0, 0.020);
              g.circle(0.62, 0, 0.020);
            });
            // Canvas seam ridges & bleacher rows
            g.inner(() => {
              for (let y = -0.55; y <= -0.43; y += 0.06) g.line(-0.46, y, 0.46, y);
              for (let y = 0.43; y <= 0.55; y += 0.06) g.line(-0.46, y, 0.46, y);
              g.radialTicks(-0.22, 0, 0.04, 0.36, 8);
              g.radialTicks(0.22, 0, 0.04, 0.36, 8);
            });
            // Center Star Ring highlight
            g.accent(() => g.circle(0, 0, 0.21));
          }
        }
      ]
    },
    {
      min: 250,
      tier: 3,
      items: [
        {
          id: 'boeing_747',
          label: 'Boeing 747 Cabin',
          headline: 'Everyone left like you fits aboard a single wide-body Boeing 747.',
          sub: 'Everyone probably reaches for the exact same window seat.',
          draw(g) {
            // 4 Underwing pylon-mounted high-bypass turbofan nacelles
            g.sub(() => {
              const eng = [[-0.36, -0.08, 0.085, 0.19], [0.36, -0.08, 0.085, 0.19], [-0.65, 0.09, 0.075, 0.17], [0.65, 0.09, 0.075, 0.17]];
              for (let i = 0; i < eng.length; i++) {
                const e = eng[i];
                g.rrect(e[0], e[1], e[2], e[3], 0.025);
                g.line(e[0] - e[2] * 0.45, e[1] - e[3] * 0.32, e[0] + e[2] * 0.45, e[1] - e[3] * 0.32);
              }
            });
            // Boeing 747-400 planform with 37.5-deg swept wings, winglets & tailplane
            g.wash(() =>
              g.sym(
                [
                  [0, -0.96], [0.06, -0.93], [0.11, -0.82], [0.13, -0.40],
                  [0.94, 0.16], [0.97, 0.28], [0.93, 0.29], [0.46, 0.08],
                  [0.13, 0.04], [0.12, 0.60], [0.40, 0.84], [0.40, 0.93],
                  [0.08, 0.81], [0.03, 0.95], [0, 0.96]
                ],
                false
              )
            );
            // Iconic 747 upper-deck hump contour, cockpit windshield & fuselage walls
            g.contour(() => {
              g.sym([[0, -0.90], [0.075, -0.84], [0.085, -0.50], [0.05, -0.34], [0, -0.30]], true);
              g.poly([[-0.06, -0.85], [0, -0.88], [0.06, -0.85], [0.04, -0.81], [-0.04, -0.81]], true);
              g.line(0, 0.64, 0, 0.95); // Vertical stabilizer spine
            });
            // Twin wide-body cabin aisles, cabin bulkheads, wing slats & trailing-edge flap panels
            g.inner(() => {
              g.line(-0.045, -0.74, -0.045, 0.72);
              g.line(0.045, -0.74, 0.045, 0.72);
              for (let y = -0.62; y <= 0.64; y += 0.21) {
                g.line(-0.11, y, 0.11, y);
              }
              // Wing control surfaces
              g.line(-0.13, -0.34, -0.92, 0.20);
              g.line(0.13, -0.34, 0.92, 0.20);
              g.line(-0.14, 0.00, -0.78, 0.22);
              g.line(0.14, 0.00, 0.78, 0.22);
            });
            g.accent(() => {
              g.line(-0.95, 0.18, -0.97, 0.28); // Port & starboard winglets
              g.line(0.95, 0.18, 0.97, 0.28);
            });
          }
        },
        {
          id: 'harbor_ferry',
          label: 'Double-Ended Ferry',
          headline: 'Everyone matching your checklist fits onto one double-ended passenger ferry.',
          sub: 'Under 250 unlocks individual human silhouettes.',
          draw(g) {
            // Fore & aft wake ripples
            g.fine(() => {
              g.quad(-0.38, -0.86, -0.54, -0.62, -0.62, -0.34);
              g.quad(0.38, -0.86, 0.54, -0.62, 0.62, -0.34);
              g.quad(-0.38, 0.86, -0.54, 0.62, -0.62, 0.34);
              g.quad(0.38, 0.86, 0.54, 0.62, 0.62, 0.34);
            });
            // Symmetrical double-ended Staten Island / Washington State Ferry hull
            g.wash(() =>
              g.sym(
                [
                  [0, -0.92], [0.22, -0.90], [0.38, -0.66], [0.46, -0.28],
                  [0.46, 0.28], [0.38, 0.66], [0.22, 0.90], [0, 0.92]
                ],
                false
              )
            );
            // Main passenger saloon superstructure + twin symmetrical pilot wheelhouses & stacks
            g.contour(() => {
              g.rrect(0, 0, 0.68, 1.24, 0.12);
              g.rrect(0, -0.44, 0.44, 0.16, 0.05); // North pilot house
              g.rrect(0, 0.44, 0.44, 0.16, 0.05);  // South pilot house
              g.rrect(0, 0, 0.22, 0.44, 0.05);     // Funnel casing
            });
            // Bow & stern vehicle loading aprons + bench rows down port & starboard cabins
            g.inner(() => {
              g.line(-0.20, -0.82, 0.20, -0.82);
              g.line(-0.20, 0.82, 0.20, 0.82);
              for (let y = -0.30; y <= 0.31; y += 0.10) {
                g.line(-0.30, y, -0.15, y);
                g.line(0.15, y, 0.30, y);
              }
              // Outboard life rafts
              for (let y = -0.24; y <= 0.25; y += 0.24) {
                g.circle(-0.40, y, 0.032);
                g.circle(0.40, y, 0.032);
              }
            });
            g.accent(() => {
              g.circle(0, -0.09, 0.045);
              g.circle(0, 0.09, 0.045);
            });
          }
        },
        {
          id: 'reading_rotunda',
          label: 'Library Reading Room',
          headline: 'Everyone remaining fits at the radial desks of one domed library reading room.',
          sub: 'Pin-drop silence — and everyone brought the same book.',
          draw(g) {
            // British Museum Round Reading Room: outer masonry drum with 20 perimeter bookstack alcoves
            g.wash(() => g.circle(0, 0, 0.93));
            g.contour(() => {
              g.circle(0, 0, 0.80);
              // Central circular superintendent's desk & concentric card-catalog rings
              g.circle(0, 0, 0.24);
              g.circle(0, 0, 0.14);
            });
            // 16 radial oak reading tables with dual-sided reader stations + bookstack piers!
            g.sub(() => {
              for (let i = 0; i < 16; i++) {
                const a = (i / 16) * TAU;
                if (Math.abs(a - Math.PI * 0.5) < 0.12) continue; // South entrance aisle
                const ca = Math.cos(a);
                const sa = Math.sin(a);
                const nx = -sa * 0.032;
                const ny = ca * 0.032;
                g.poly(
                  [
                    [ca * 0.30 - nx, sa * 0.30 - ny],
                    [ca * 0.72 - nx, sa * 0.72 - ny],
                    [ca * 0.72 + nx, sa * 0.72 + ny],
                    [ca * 0.30 + nx, sa * 0.30 + ny]
                  ],
                  true
                );
              }
              g.rrect(0, 0.86, 0.18, 0.14, 0.01); // Entrance vestibule
            });
            // 32 perimeter bookstack bays & dome skylight ribs
            g.inner(() => {
              g.spokes(0.80, 0.93, 32);
              g.circle(0, 0, 0.52);
            });
            g.accent(() => g.circle(0, 0, 0.075));
          }
        },
        {
          id: 'cinema_auditorium',
          label: 'Grand Cinema Hall',
          headline: 'All of your remaining matches fit inside one curved-screen cinema auditorium.',
          sub: 'Not even a second screening room required.',
          draw(g) {
            // Flared acoustic auditorium shell + rear projection booth & twin light-lock vestibules
            g.wash(() =>
              g.sym(
                [
                  [0, -0.84], [0.64, -0.84], [0.86, 0.68],
                  [0.86, 0.88], [0, 0.88]
                ],
                false
              )
            );
            // Stage apron, rear booth wall & twin entry light-locks
            g.contour(() => {
              g.quad(-0.60, -0.56, 0, -0.46, 0.60, -0.56); // Stage lip
              g.line(-0.84, 0.66, 0.84, 0.66);
              g.rrect(0, 0.77, 0.52, 0.18, 0.02); // Projection booth
              g.rrect(-0.60, 0.77, 0.24, 0.18, 0.02); // Left vestibule
              g.rrect(0.60, 0.77, 0.24, 0.18, 0.02);  // Right vestibule
            });
            // Twin stepped aisles dividing seating into Left, Center & Right banks + behind-screen speakers
            g.sub(() => {
              g.line(-0.24, -0.42, -0.36, 0.64);
              g.line(0.24, -0.42, 0.36, 0.64);
              g.rrect(-0.34, -0.74, 0.10, 0.08, 0.01); // L/C/R speaker stacks
              g.rrect(0, -0.72, 0.12, 0.08, 0.01);
              g.rrect(0.34, -0.74, 0.10, 0.08, 0.01);
            });
            // 9 curved rows of plush cinema seating + side acoustic wall baffles + projector beam!
            g.inner(() => {
              for (let k = 0; k < 9; k++) {
                const y = -0.34 + k * 0.115;
                const hw = 0.58 + k * 0.024;
                g.quad(-hw, y - 0.03, 0, y + 0.03, hw, y - 0.03);
              }
              // Subtle dual projection beam lines from booth window
              g.line(-0.04, 0.66, -0.54, -0.66);
              g.line(0.04, 0.66, 0.54, -0.66);
            });
            // Deeply curved panoramic IMAX / CinemaScope screen in warm brass!
            g.accent(() => {
              g.quad(-0.58, -0.68, 0, -0.54, 0.58, -0.68);
              g.quad(-0.58, -0.65, 0, -0.51, 0.58, -0.65);
            });
          }
        }
      ]
    },

    // --- TIER 4 · THE ROOM (2 .. 249) ---
    {
      min: 120,
      tier: 4,
      items: [
        {
          id: 'reception_pavilion',
          label: 'Banquet Pavilion',
          headline: 'Everyone left like you fits around the tables of one garden banquet pavilion.',
          sub: 'Every dot on screen has resolved into an individual human silhouette.',
          draw(g) {
            // Glazed conservatory banquet pavilion with corner terrace steps
            g.wash(() => g.rrect(0, 0, 1.78, 1.62, 0.10));
            // Structural perimeter wall, raised bandstand stage & central parquet dance floor
            g.contour(() => {
              g.rrect(0, 0.06, 0.56, 0.56, 0.03); // Dance floor
              g.rrect(0, -0.66, 0.56, 0.22, 0.03); // Bandstand stage
            });
            // 8 Round Banquet Tables — EACH surrounded by 8 individual chairs!
            const tables = [
              [-0.58, -0.44], [0.58, -0.44],
              [-0.60, 0.06],  [0.60, 0.06],
              [-0.58, 0.54],  [0.58, 0.54],
              [-0.19, 0.58],  [0.19, 0.58]
            ];
            g.sub(() => {
              for (let i = 0; i < tables.length; i++) {
                g.circle(tables[i][0], tables[i][1], 0.125);
              }
            });
            g.inner(() => {
              for (let i = 0; i < tables.length; i++) {
                const tx = tables[i][0];
                const ty = tables[i][1];
                g.chairRing(tx, ty, 0.125, 0.125, 8, 0.026, 0.018);
                g.circle(tx, ty, 0.032);
              }
              // Parquet dance-floor grid
              for (let d = -0.18; d <= 0.19; d += 0.12) {
                g.line(d, -0.22, d, 0.34);
                g.line(-0.28, 0.06 + d, 0.28, 0.06 + d);
              }
              // Perimeter column piers
              for (let x = -0.82; x <= 0.83; x += 0.41) {
                g.rrect(x, -0.81, 0.05, 0.05, 0);
                g.rrect(x, 0.81, 0.05, 0.05, 0);
              }
            });
            // Grand piano on the bandstand
            g.accent(() => {
              g.poly([[-0.14, -0.71], [-0.02, -0.71], [-0.02, -0.61], [-0.11, -0.58]], true);
              g.circle(0.12, -0.66, 0.035);
            });
          }
        },
        {
          id: 'lecture_hall',
          label: 'Lecture Amphitheater',
          headline: 'Everyone matching your checklist fits inside one tiered university lecture hall.',
          sub: 'Roughly Dunbar’s number — every silhouette is one person.',
          draw(g) {
            // Clean architectural fan-shaped masonry lecture hall
            g.wash(() =>
              g.sym(
                [
                  [0, -0.82], [0.52, -0.82], [0.88, 0.24],
                  [0.74, 0.74], [0.36, 0.86], [0, 0.88]
                ],
                false
              )
            );
            // Curved professor's demonstration bench, chalkboard ledge & twin rear entry doors
            g.contour(() => {
              g.rrect(0, -0.58, 0.48, 0.12, 0.03); // Demonstration table
              g.line(-0.38, -0.78, 0.38, -0.78);   // Chalkboard wall ledge
              // 5 concentric curved writing-desk tiers strictly inside walls!
              for (let k = 0; k < 5; k++) {
                const r = 0.42 + k * 0.18;
                g.arc(0, -0.78, r, Math.PI * 0.5 - 0.47, Math.PI * 0.5 + 0.47);
              }
            });
            // 2 radial stepped aisles + rear double-door swing arcs
            g.sub(() => {
              g.line(-0.10, -0.38, -0.30, 0.54);
              g.line(0.10, -0.38, 0.30, 0.54);
              g.arc(-0.54, 0.78, 0.14, -Math.PI * 0.85, -Math.PI * 0.35);
              g.arc(0.54, 0.78, 0.14, -Math.PI * 0.65, -Math.PI * 0.15);
            });
            // Individual student chair backs tucked along all 5 curved desk tiers!
            g.inner(() => {
              for (let k = 0; k < 5; k++) {
                const r = 0.46 + k * 0.18;
                const seats = 7 + k * 2;
                for (let s = 0; s < seats; s++) {
                  const ang = Math.PI * 0.5 - 0.44 + (s / (seats - 1)) * 0.88;
                  if (Math.abs(Math.abs(ang - Math.PI * 0.5) - 0.22) < 0.045) continue; // aisle gap
                  g.arc(0, -0.78, r, ang - 0.022, ang + 0.022);
                }
              }
            });
            g.accent(() => g.circle(0, -0.68, 0.035)); // Lecturer podium spot
          }
        },
        {
          id: 'narrowbody_jet',
          label: 'Twin-Engine Jetliner',
          headline: 'Everyone left on Earth like you fits down the single aisle of one twin-engine jetliner.',
          sub: 'Every silhouette on the cabin blueprint is one actual match.',
          draw(g) {
            // Twin underwing high-bypass turbofan nacelles
            g.sub(() => {
              g.rrect(-0.34, -0.05, 0.10, 0.21, 0.03);
              g.rrect(0.34, -0.05, 0.10, 0.21, 0.03);
              g.line(-0.39, -0.11, -0.29, -0.11);
              g.line(0.29, -0.11, 0.39, -0.11);
            });
            // A320 / 737 single-aisle jetliner planform with sharklets
            g.wash(() =>
              g.sym(
                [
                  [0, -0.95], [0.06, -0.91], [0.12, -0.76], [0.13, -0.26],
                  [0.93, 0.16], [0.95, 0.27], [0.91, 0.28], [0.13, 0.05],
                  [0.12, 0.62], [0.40, 0.85], [0.40, 0.93], [0.07, 0.82],
                  [0.02, 0.95], [0, 0.95]
                ],
                false
              )
            );
            // Cockpit 6-pane windshield, forward/aft galleys & vertical stabilizer
            g.contour(() => {
              g.poly([[-0.08, -0.82], [0, -0.87], [0.08, -0.82], [0.06, -0.77], [-0.06, -0.77]], true);
              g.line(-0.12, -0.68, 0.12, -0.68);
              g.line(-0.11, 0.62, 0.11, 0.62);
              g.line(0, 0.64, 0, 0.95);
            });
            // Cutaway 3-and-3 passenger seat rows flanking the single center aisle + wing flaps!
            g.inner(() => {
              for (let y = -0.60; y <= 0.56; y += 0.075) {
                g.line(-0.11, y, -0.025, y);
                g.line(0.025, y, 0.11, y);
              }
              g.line(-0.13, -0.20, -0.90, 0.20);
              g.line(0.13, -0.20, 0.90, 0.20);
              // Flap track fairings
              for (let k = 1; k <= 3; k++) {
                const fx = 0.22 + k * 0.16;
                const fy = 0.06 + k * 0.045;
                g.line(-fx, fy, -fx, fy + 0.06);
                g.line(fx, fy, fx, fy + 0.06);
              }
            });
            g.accent(() => {
              g.line(-0.12, -0.06, -0.12, 0.02); // Overwing emergency exit hatches
              g.line(0.12, -0.06, 0.12, 0.02);
            });
          }
        }
      ]
    },
    {
      min: 60,
      tier: 4,
      items: [
        {
          id: 'commuter_railcar',
          label: 'Commuter Train Car',
          headline: 'One commuter train car of people sharing your exact checklist.',
          sub: 'Uncomfortably specific eye contact up and down the center aisle.',
          draw(g) {
            // Railroad steel rails & timber crossties extending fore & aft
            g.fine(() => {
              g.line(-0.26, -0.98, -0.26, 0.98);
              g.line(0.26, -0.98, 0.26, 0.98);
              for (let y = -0.96; y <= 0.97; y += 0.09) {
                if (Math.abs(y) > 0.84) g.line(-0.36, y, 0.36, y);
              }
            });
            // Coupler diaphragms at both ends
            g.sub(() => {
              g.rrect(0, -0.89, 0.30, 0.08, 0.02);
              g.rrect(0, 0.89, 0.30, 0.08, 0.02);
            });
            // Streamlined commuter railcar body
            g.wash(() => g.rrect(0, 0, 0.88, 1.72, 0.12));
            // Inner cabin wall, operator cab bulkheads & 3 pairs of sliding pocket doors!
            g.contour(() => {
              g.rrect(0, 0, 0.74, 1.54, 0.06);
              g.line(-0.37, -0.66, 0.37, -0.66);
              g.line(-0.37, 0.66, 0.37, 0.66);
              // Sliding door thresholds (left & right at y = -0.46, 0, +0.46)
              for (let d = -0.46; d <= 0.47; d += 0.46) {
                g.rrect(-0.41, d, 0.07, 0.18, 0.01);
                g.rrect(0.41, d, 0.07, 0.18, 0.01);
              }
            });
            // Commuter 2x2 transverse & longitudinal seats + center aisle grab-poles!
            g.inner(() => {
              const bays = [-0.28, -0.18, 0.18, 0.28];
              for (let i = 0; i < bays.length; i++) {
                const y = bays[i];
                g.rrect(-0.24, y, 0.22, 0.07, 0.01);
                g.rrect(0.24, y, 0.22, 0.07, 0.01);
              }
              g.rrect(-0.26, -0.58, 0.18, 0.08, 0.01);
              g.rrect(0.26, -0.58, 0.18, 0.08, 0.01);
              g.rrect(-0.26, 0.58, 0.18, 0.08, 0.01);
              g.rrect(0.26, 0.58, 0.18, 0.08, 0.01);
            });
            g.accent(() => {
              g.circle(0, -0.46, 0.025);
              g.circle(0, 0, 0.025);
              g.circle(0, 0.46, 0.025);
            });
          }
        },
        {
          id: 'planetarium_dome',
          label: 'Planetarium Star Dome',
          headline: 'Everyone left like you fits beneath the reclined ring of a neighborhood planetarium dome.',
          sub: 'Fewer than a hundred statistical matches remain on Earth.',
          draw(g) {
            // Double-shell circular planetarium dome with twin light-trap entry vestibules
            g.wash(() => g.circle(0, 0, 0.93));
            g.contour(() => {
              g.circle(0, 0, 0.80);
              g.circle(0, 0, 0.22); // Central projector safety rail
              // Iconic dumbbell Zeiss Star Projector on azimuth gimbal!
              g.line(-0.08, -0.08, 0.08, 0.08);
              g.circle(-0.09, -0.09, 0.055);
              g.circle(0.09, 0.09, 0.055);
              g.rrect(0, 0, 0.08, 0.08, 0.02);
            });
            // 4 cardinal aisles & 3 concentric circular rows of reclined stargazing seats
            g.sub(() => {
              for (let r = 0.34; r <= 0.68; r += 0.16) {
                for (let q = 0; q < 4; q++) {
                  const a0 = q * Math.PI * 0.5 + 0.12;
                  const a1 = (q + 1) * Math.PI * 0.5 - 0.12;
                  g.arc(0, 0, r, a0, a1);
                }
              }
            });
            // Reclined headrest ticks, horizon degree compass & subtle Big Dipper constellation!
            g.inner(() => {
              g.spokes(0.80, 0.85, 36);
              for (let r = 0.34; r <= 0.68; r += 0.16) {
                const n = Math.round(r * 36);
                for (let i = 0; i < n; i++) {
                  const a = (i / n) * TAU;
                  if (Math.abs(Math.sin(a * 2)) < 0.22) continue;
                  g.radialTicks(0, 0, r, r + 0.045, 1, a);
                }
              }
            });
            // Subtle celestial Big Dipper asterism projected overhead in warm brass
            g.accent(() => {
              const dipper = [[-0.42, -0.44], [-0.28, -0.48], [-0.18, -0.40], [-0.08, -0.34], [-0.06, -0.22], [0.08, -0.20], [0.10, -0.32], [-0.08, -0.34]];
              g.poly(dipper, false);
              for (let i = 0; i < dipper.length - 1; i++) {
                g.circle(dipper[i][0], dipper[i][1], 0.015);
              }
            });
          }
        },
        {
          id: 'corner_cafe',
          label: 'Corner Coffeehouse',
          headline: 'Everyone matching your profile fits inside one bustling corner coffeehouse.',
          sub: 'And every barista ticket would have the exact same order.',
          draw(g) {
            // Sidewalk corner awning & chamfered corner café architectural floorplan
            g.sub(() => {
              g.poly([[0.42, -0.92], [0.92, -0.42], [0.84, -0.34], [0.34, -0.84]], true);
            });
            g.wash(() =>
              g.poly(
                [
                  [-0.84, -0.84], [0.42, -0.84], [0.84, -0.42],
                  [0.84, 0.84], [-0.84, 0.84]
                ],
                true
              )
            );
            // L-shaped Espresso Bar, pastry vitrine & corner double-door swing arcs
            g.contour(() => {
              g.poly(
                [
                  [-0.72, -0.72], [-0.08, -0.72], [-0.08, 0.14],
                  [-0.26, 0.14], [-0.26, -0.54], [-0.72, -0.54]
                ],
                true
              );
              g.rrect(-0.17, -0.16, 0.14, 0.28, 0.02); // Pastry display case
              // Back wall banquette bench
              g.rrect(0.02, 0.75, 1.48, 0.12, 0.02);
            });
            // 4 round café tables with chairs + 3 banquette tables + 5 espresso barstools!
            g.sub(() => {
              const rounds = [[0.34, -0.30], [0.56, 0.08], [0.22, 0.22], [-0.52, 0.28]];
              for (let i = 0; i < rounds.length; i++) {
                g.circle(rounds[i][0], rounds[i][1], 0.11);
              }
              for (let x = -0.48; x <= 0.49; x += 0.48) {
                g.rrect(x, 0.56, 0.20, 0.16, 0.03);
              }
            });
            g.inner(() => {
              // Barstools along espresso counter
              for (let y = -0.56; y <= 0.06; y += 0.15) {
                g.circle(0.02, y, 0.038);
              }
              const rounds = [[0.34, -0.30], [0.56, 0.08], [0.22, 0.22], [-0.52, 0.28]];
              for (let i = 0; i < rounds.length; i++) {
                g.chairRing(rounds[i][0], rounds[i][1], 0.11, 0.11, 4, 0.038, 0.024);
              }
              // Corner entry door swing arcs
              g.arc(0.45, -0.81, 0.18, Math.PI * 0.25, Math.PI * 0.75);
              g.arc(0.81, -0.45, 0.18, Math.PI * 0.75, Math.PI * 1.25);
            });
            // Twin-group brass espresso machine & grinder on bar
            g.accent(() => {
              g.rrect(-0.46, -0.63, 0.22, 0.10, 0.02);
              g.circle(-0.64, -0.63, 0.035);
            });
          }
        }
      ]
    },
    {
      min: 28,
      tier: 4,
      items: [
        {
          id: 'school_bus',
          label: 'Yellow School Bus',
          headline: 'One yellow school bus of people sharing your exact profile.',
          sub: 'Drop one last hobby, allergy, or odd habit to clear the aisles.',
          draw(g) {
            // Crossover front mirrors, West Coast side mirrors & swing-out octagonal STOP arm!
            g.sub(() => {
              g.line(-0.44, -0.54, -0.58, -0.48);
              g.line(0.44, -0.54, 0.58, -0.48);
              g.circle(-0.36, -0.92, 0.03);
              g.circle(0.36, -0.92, 0.03);
              // Wheel tires peeking at front & rear axles
              g.rrect(-0.46, -0.68, 0.06, 0.18, 0.02);
              g.rrect(0.46, -0.68, 0.06, 0.18, 0.02);
              g.rrect(-0.48, 0.50, 0.06, 0.20, 0.02);
              g.rrect(0.48, 0.50, 0.06, 0.20, 0.02);
            });
            // Type-C American School Bus body: tapered steel engine hood + passenger body
            g.wash(() =>
              g.sym(
                [
                  [0, -0.94], [0.32, -0.91], [0.38, -0.62], [0.46, -0.54],
                  [0.46, 0.84], [0.38, 0.92], [0, 0.93]
                ],
                false
              )
            );
            // Wraparound windshield, driver station, bi-fold boarding stairwell & rear emergency door
            g.contour(() => {
              g.poly([[-0.38, -0.54], [0, -0.63], [0.38, -0.54], [0.35, -0.44], [-0.35, -0.44]], true);
              g.circle(-0.24, -0.36, 0.055); // Driver steering wheel
              g.poly([[0.28, -0.44], [0.45, -0.44], [0.45, -0.28], [0.28, -0.28]], true); // Stairwell
              g.rrect(0, 0.90, 0.28, 0.06, 0.01); // Rear emergency exit
            });
            // 9 rows of twin 3-passenger vinyl bench seats + 2 square roof escape hatches!
            g.inner(() => {
              for (let r = 0; r < 9; r++) {
                const y = -0.20 + r * 0.12;
                g.rrect(-0.25, y, 0.30, 0.08, 0.015);
                g.rrect(0.25, y, 0.30, 0.08, 0.015);
              }
              g.rrect(0, -0.02, 0.16, 0.16, 0.02); // Fwd roof hatch
              g.rrect(0, 0.46, 0.16, 0.16, 0.02);  // Aft roof hatch
              // Hood louvers
              g.line(-0.16, -0.82, -0.16, -0.68);
              g.line(0.16, -0.82, 0.16, -0.68);
            });
            // Deployed left-side STOP paddle & front bumper
            g.accent(() => {
              g.line(-0.46, -0.36, -0.58, -0.36);
              g.circle(-0.60, -0.36, 0.035);
            });
          }
        },
        {
          id: 'homeroom_class',
          label: 'School Classroom',
          headline: 'Everyone left like you fits at the desks of a single school classroom.',
          sub: 'One chalkboard, a few rows of desks, and zero strangers.',
          draw(g) {
            // Classroom masonry walls with recessed window bays & swinging corridor door
            g.wash(() => g.rrect(0, 0, 1.72, 1.56, 0.04));
            g.contour(() => {
              // Chalkboard ledge at front + angled Teacher's Desk & globe
              g.rrect(0, -0.73, 0.96, 0.05, 0.01);
              g.rrect(-0.44, -0.50, 0.34, 0.16, 0.02); // Teacher's desk
              // Corridor entry door & swing arc (top right)
              g.line(0.86, -0.58, 0.64, -0.58);
              g.arc(0.86, -0.58, 0.22, Math.PI * 0.5, Math.PI);
              // Rear bookshelves & coat cubbies
              g.rrect(0, 0.72, 1.16, 0.09, 0.01);
            });
            // 4x4 Grid of 16 Student Desks — EACH with its own sculpted chair tucked behind!
            g.sub(() => {
              for (let r = 0; r < 4; r++) {
                const y = -0.22 + r * 0.27;
                for (let c = 0; c < 4; c++) {
                  const x = -0.52 + c * 0.35;
                  g.rrect(x, y, 0.22, 0.13, 0.02);
                }
              }
            });
            g.inner(() => {
              for (let r = 0; r < 4; r++) {
                const y = -0.22 + r * 0.27;
                for (let c = 0; c < 4; c++) {
                  const x = -0.52 + c * 0.35;
                  g.planChair(x, y + 0.10, 0.12, 0.06, -Math.PI * 0.5);
                }
              }
              g.planChair(-0.44, -0.62, 0.14, 0.08, Math.PI * 0.5); // Teacher's chair
              // 4 Recessed exterior window bays on left wall
              for (let wy = -0.48; wy <= 0.49; wy += 0.32) {
                g.rrect(-0.86, wy, 0.05, 0.20, 0);
              }
            });
            g.accent(() => g.circle(-0.20, -0.50, 0.042)); // Classroom desktop globe!
          }
        },
        {
          id: 'sailing_schooner',
          label: 'Two-Masted Yacht',
          headline: 'Everyone matching your checklist fits on the deck of a single two-masted sailing yacht.',
          sub: 'One more specific detail trims the crew down to single digits.',
          draw(g) {
            // Graceful bow & stern ocean wake V-waves
            g.fine(() => {
              g.quad(-0.28, -0.56, -0.64, 0.08, -0.58, 0.90);
              g.quad(0.28, -0.56, 0.64, 0.08, 0.58, 0.90);
            });
            // Clipper-bowed Two-Masted Schooner hull + inner teak gunwale coaming
            g.wash(() =>
              g.sym(
                [
                  [0, -0.86], [0.22, -0.54], [0.36, -0.14], [0.38, 0.24],
                  [0.32, 0.68], [0.20, 0.88], [0, 0.89]
                ],
                true
              )
            );
            g.sub(() =>
              g.sym(
                [
                  [0, -0.78], [0.18, -0.48], [0.30, -0.12], [0.32, 0.24],
                  [0.26, 0.64], [0.16, 0.82], [0, 0.83]
                ],
                true
              )
            );
            // Bowsprit, Foremast & Mainmast, Coachroof skylight & Aft Cockpit well with Helm Wheel!
            g.contour(() => {
              g.line(0, -0.76, 0, -1.00); // Bowsprit
              g.circle(0, -0.32, 0.048);  // Foremast
              g.circle(0, 0.18, 0.052);   // Mainmast
              g.rrect(0, -0.06, 0.28, 0.30, 0.04); // Coachroof cabin
              g.ellipse(0, 0.58, 0.18, 0.20);      // Aft cockpit bench well
            });
            // Teak deck planking lines, shrouds & spoked ship's helm wheel
            g.inner(() => {
              for (let x = -0.22; x <= 0.23; x += 0.11) {
                if (Math.abs(x) < 0.03) continue;
                g.line(x, -0.46, x, 0.68);
              }
              g.line(-0.34, -0.32, 0.34, -0.32); // Spreaders / shrouds
              g.line(-0.36, 0.18, 0.36, 0.18);
              g.circle(0, 0.66, 0.065); // Ship's wheel
              g.radialTicks(0, 0.66, 0.01, 0.075, 8);
            });
            // Billowing Jib, Foresail & Mainsail booms/curves in warm brass!
            g.accent(() => {
              g.quad(0, -0.98, 0.24, -0.68, 0.16, -0.38); // Jib sail
              g.quad(0, -0.32, 0.48, -0.16, 0.38, 0.12);  // Foresail
              g.quad(0, 0.18, 0.52, 0.36, 0.38, 0.72);    // Mainsail
            });
          }
        }
      ]
    },
    {
      min: 13,
      tier: 4,
      items: [
        {
          id: 'freight_elevator',
          label: 'Freight Elevator Cab',
          headline: 'A single freight elevator cab of your remaining statistical lookalikes.',
          sub: 'Nobody is reaching for the floor button first.',
          draw(g) {
            // Concrete hoistway shaft perimeter with corner structural columns & counterweight frame
            g.sub(() => {
              g.rrect(0, 0, 1.72, 1.72, 0.04);
              // Rear counterweight assembly with X-bracing
              g.rrect(0, 0.78, 0.76, 0.10, 0.01);
              g.line(-0.36, 0.73, 0.36, 0.83);
              g.line(0.36, 0.73, -0.36, 0.83);
              // Left & right steel T-section guide rails
              g.rrect(-0.78, 0, 0.09, 0.34, 0.01);
              g.rrect(0.78, 0, 0.09, 0.34, 0.01);
            });
            // Heavy-duty steel freight elevator cab
            g.wash(() => g.rrect(0, 0, 1.42, 1.38, 0.04));
            // Inner timber rub-rails & bi-parting center sliding freight doors!
            g.contour(() => {
              g.poly([[-0.63, -0.61], [-0.63, 0.61], [0.63, 0.61], [0.63, -0.61]], false);
              // Bi-parting sliding door panels (parted slightly at center)
              g.rrect(-0.34, -0.69, 0.54, 0.06, 0.01);
              g.rrect(0.34, -0.69, 0.54, 0.06, 0.01);
            });
            // Checkered steel floor grid & collapsible safety gate scissor lattice
            g.inner(() => {
              for (let v = -0.42; v <= 0.43; v += 0.28) {
                g.line(v, -0.58, v, 0.58);
                g.line(-0.58, v, 0.58, v);
              }
              g.rrect(-0.82, -0.82, 0.08, 0.08, 0);
              g.rrect(0.82, -0.82, 0.08, 0.08, 0);
              g.rrect(-0.82, 0.82, 0.08, 0.08, 0);
              g.rrect(0.82, 0.82, 0.08, 0.08, 0);
            });
            // Dual brass operator control button panels flanking the door
            g.accent(() => {
              g.rrect(-0.58, -0.52, 0.05, 0.14, 0.01);
              g.rrect(0.58, -0.52, 0.05, 0.14, 0.01);
            });
          }
        },
        {
          id: 'boardroom_table',
          label: 'Conference Boardroom',
          headline: 'Everyone left like you fits around a single oval conference boardroom table.',
          sub: 'Under twenty people out of 8.3 billion — almost 1-of-1.',
          draw(g) {
            // Glass-walled executive boardroom with credenza, wall display & double glass doors
            g.sub(() => {
              g.rrect(0, 0, 1.82, 1.42, 0.06);
              g.rrect(0, -0.66, 0.84, 0.07, 0.01); // Credenza sideboard
              g.line(-0.89, -0.34, -0.89, 0.34);   // Wall presentation screen
              // Double entry door swing arcs (bottom right)
              g.arc(0.52, 0.71, 0.16, -Math.PI, -Math.PI * 0.5);
              g.arc(0.84, 0.71, 0.16, -Math.PI * 0.5, 0);
            });
            // Boat-shaped walnut conference table
            g.wash(() => g.superEllipse(0.66, 0.36, 2.35));
            // 14 Sculpted Executive Swivel Armchairs around the table!
            g.contour(() => g.chairRing(0, 0, 0.66, 0.36, 14, 0.052, 0.045));
            // Individual leather desk blotters around the table perimeter
            g.inner(() => {
              g.superEllipse(0.58, 0.28, 2.35);
              for (let i = 0; i < 14; i++) {
                const a = (i / 14) * TAU - Math.PI * 0.5;
                g.circle(Math.cos(a) * 0.50, Math.sin(a) * 0.23, 0.022);
              }
            });
            // Brushed-brass central AV / power cable hatch strip
            g.accent(() => g.rrect(0, 0, 0.54, 0.07, 0.02));
          }
        },
        {
          id: 'campfire_ring',
          label: 'Campfire Clearing',
          headline: 'Everyone matching your stack fits on the log benches around a single campfire.',
          sub: 'All telling remarkably identical life stories.',
          draw(g) {
            // Woodland pine-grove canopy framing the circular forest glade
            g.wash(() => g.scallopRing(0, 0, 0.88, 0.88, 16, 0.06, true));
            // 6 Split-cedar timber benches arranged in a hexagon around the hearth!
            g.contour(() => {
              for (let i = 0; i < 6; i++) {
                const a = (i / 6) * TAU + 0.26;
                const ca = Math.cos(a);
                const sa = Math.sin(a);
                const tx = -sa * 0.24;
                const ty = ca * 0.24;
                const nx = ca * 0.06;
                const ny = sa * 0.06;
                const bx = ca * 0.58;
                const by = sa * 0.58;
                g.poly(
                  [
                    [bx - tx - nx, by - ty - ny],
                    [bx + tx - nx, by + ty - ny],
                    [bx + tx + nx, by + ty + ny],
                    [bx - tx + nx, by - ty + ny]
                  ],
                  true
                );
              }
            });
            // Ring of 10 rounded river-stone hearth boulders
            g.sub(() => {
              for (let i = 0; i < 10; i++) {
                const a = (i / 10) * TAU;
                g.ellipse(Math.cos(a) * 0.24, Math.sin(a) * 0.24, 0.055, 0.042, a + 0.4);
              }
            });
            // Wood grain lines on log benches & evergreen crown needles
            g.inner(() => {
              g.circle(0, 0, 0.78);
              for (let i = 0; i < 6; i++) {
                const a = (i / 6) * TAU + 0.26;
                const bx = Math.cos(a) * 0.58;
                const by = Math.sin(a) * 0.58;
                g.line(bx + Math.sin(a) * 0.18, by - Math.cos(a) * 0.18, bx - Math.sin(a) * 0.18, by + Math.cos(a) * 0.18);
              }
            });
            // Crossed campfire logs & warm-brass hearth glow at center!
            g.accent(() => {
              g.circle(0, 0, 0.15);
              g.circle(0, 0, 0.065);
              for (let i = 0; i < 3; i++) {
                const a = (i / 3) * Math.PI + 0.2;
                g.line(Math.cos(a) * -0.14, Math.sin(a) * -0.14, Math.cos(a) * 0.14, Math.sin(a) * 0.14);
              }
            });
          }
        }
      ]
    },
    {
      min: 7,
      tier: 4,
      items: [
        {
          id: 'dinner_party_table',
          label: 'Dinner Party Table',
          headline: 'One round dinner party table of your statistical doubles.',
          sub: 'At least nobody at the table will argue over the menu.',
          draw(g) {
            // Paneled octagonal dining room perimeter & sideboard buffet
            g.fine(() => {
              const oct = [];
              for (let i = 0; i < 8; i++) {
                const a = (i / 8) * TAU + Math.PI / 8;
                oct.push([Math.cos(a) * 0.96, Math.sin(a) * 0.96]);
              }
              g.poly(oct, true);
              g.rrect(0, -0.84, 0.52, 0.10, 0.02);
            });
            // Generous round linen-draped banquet table
            g.wash(() => g.circle(0, 0, 0.62));
            // 10 Sculpted Upholstered Dining Chairs around the table
            g.contour(() => g.chairRing(0, 0, 0.62, 0.62, 10, 0.062, 0.045));
            // 10 Complete Fine-Dining Place Settings (charger plate, inner plate, wine glass & cutlery!)
            g.sub(() => {
              g.circle(0, 0, 0.56);
              for (let i = 0; i < 10; i++) {
                const a = (i / 10) * TAU - Math.PI * 0.5;
                const px0 = Math.cos(a) * 0.46;
                const py0 = Math.sin(a) * 0.46;
                g.circle(px0, py0, 0.062);
              }
            });
            g.inner(() => {
              for (let i = 0; i < 10; i++) {
                const a = (i / 10) * TAU - Math.PI * 0.5;
                const ca = Math.cos(a);
                const sa = Math.sin(a);
                const tx = -sa;
                const ty = ca;
                const px0 = ca * 0.46;
                const py0 = sa * 0.46;
                g.circle(px0, py0, 0.038); // Inner plate
                // Wine glass circle to upper-right of plate
                g.circle(ca * 0.36 + tx * 0.06, sa * 0.36 + ty * 0.06, 0.018);
                // Fork & knife ticks flanking plate
                g.line(ca * 0.42 - tx * 0.082, sa * 0.42 - ty * 0.082, ca * 0.50 - tx * 0.082, sa * 0.50 - ty * 0.082);
                g.line(ca * 0.42 + tx * 0.082, sa * 0.42 + ty * 0.082, ca * 0.50 + tx * 0.082, sa * 0.50 + ty * 0.082);
              }
            });
            // Central candelabra / floral centerpiece
            g.accent(() => {
              g.circle(0, 0, 0.13);
              g.circle(0, 0, 0.045);
              g.spokes(0.05, 0.12, 6);
            });
          }
        },
        {
          id: 'crew_capsule',
          label: 'Spacecraft Capsule',
          headline: 'Everyone left like you could squeeze into a single spacecraft crew capsule.',
          sub: 'Single-digit territory — one more fact should seal it.',
          draw(g) {
            // Outer ablative heatshield & 4 RCS thruster pods around perimeter
            g.sub(() => {
              for (let i = 0; i < 4; i++) {
                const a = (i / 4) * TAU + Math.PI * 0.25;
                g.rrect(Math.cos(a) * 0.89, Math.sin(a) * 0.89, 0.10, 0.10, 0.02);
              }
            });
            g.wash(() => g.circle(0, 0, 0.90));
            // Pressurized inner crew hull, central overhead docking hatch & flight control console
            g.contour(() => {
              g.circle(0, 0, 0.76);
              g.circle(0, 0, 0.19); // Docking mechanism ring
              // Semicircular instrument display panel at top
              g.arc(0, 0, 0.64, -Math.PI * 0.78, -Math.PI * 0.22);
              g.arc(0, 0, 0.54, -Math.PI * 0.76, -Math.PI * 0.24);
            });
            // 6 Contoured Astronaut Acceleration Couches arranged radially!
            g.sub(() => {
              for (let i = 0; i < 6; i++) {
                const a = Math.PI * 0.08 + (i / 5) * Math.PI * 0.84; // fanned across lower/mid cabin
                const ca = Math.cos(a);
                const sa = Math.sin(a);
                const tx = -sa;
                const ty = ca;
                // Contoured couch body + headrest
                g.poly(
                  [
                    [ca * 0.28 - tx * 0.075, sa * 0.28 - ty * 0.075],
                    [ca * 0.64 - tx * 0.095, sa * 0.64 - ty * 0.095],
                    [ca * 0.64 + tx * 0.095, sa * 0.64 + ty * 0.095],
                    [ca * 0.28 + tx * 0.075, sa * 0.28 + ty * 0.075]
                  ],
                  true
                );
              }
            });
            // Structural radial ribs, couch headrests & side entry hatch
            g.inner(() => {
              g.spokes(0.76, 0.90, 24);
              for (let i = 0; i < 6; i++) {
                const a = Math.PI * 0.08 + (i / 5) * Math.PI * 0.84;
                g.circle(Math.cos(a) * 0.57, Math.sin(a) * 0.57, 0.042);
              }
            });
            // Central docking latch & console screens in warm brass
            g.accent(() => {
              g.rrect(0, 0, 0.14, 0.14, 0.03);
              g.circle(0, -0.59, 0.03);
              g.circle(-0.18, -0.56, 0.025);
              g.circle(0.18, -0.56, 0.025);
            });
          }
        },
        {
          id: 'living_room_rug',
          label: 'Living Room Sectional',
          headline: 'Everyone matching your checklist fits onto one living room sectional sofa.',
          sub: 'Small enough for one unforgettable game night.',
          draw(g) {
            // Room architecture with stone fireplace mantel & built-in bookcases along north wall
            g.sub(() => {
              g.rrect(0, 0, 1.80, 1.56, 0.04);
              g.rrect(0, -0.70, 0.48, 0.14, 0.01);  // Fireplace hearth
              g.rrect(-0.56, -0.73, 0.44, 0.09, 0); // Left bookcase
              g.rrect(0.56, -0.73, 0.44, 0.09, 0);  // Right bookcase
            });
            // Large woven living-room area rug
            g.wash(() => g.rrect(0, 0.08, 1.48, 1.18, 0.05));
            // Plush U/L-Shaped Modular Sectional Sofa + Lounge Armchair + Coffee Table!
            g.contour(() => {
              // Sectional outer frame (facing the fireplace & coffee table)
              g.poly(
                [
                  [-0.64, -0.18], [-0.40, -0.18], [-0.40, 0.30], [0.40, 0.30],
                  [0.40, 0.04], [0.64, 0.04], [0.64, 0.56], [-0.64, 0.56]
                ],
                true
              );
              // Rounded coffee table at center + angled accent armchair at top-right
              g.rrect(0.02, 0.02, 0.54, 0.28, 0.07);
              g.planChair(0.50, -0.28, 0.24, 0.20, Math.PI * 0.75);
            });
            // Individual seat cushions, plush back cushions, end table, floor lamp & rug fringe!
            g.inner(() => {
              // Backrest cushion line along sofa L
              g.poly([[-0.56, -0.18], [-0.56, 0.48], [0.56, 0.48], [0.56, 0.04]], false);
              // Seat cushion divisions
              g.line(-0.40, 0.06, -0.64, 0.06);
              g.line(-0.14, 0.30, -0.14, 0.56);
              g.line(0.14, 0.30, 0.14, 0.56);
              g.circle(-0.54, -0.36, 0.09); // Round side table / lamp
              // Rug fringe ticks on left & right edges
              for (let y = -0.44; y <= 0.60; y += 0.13) {
                g.line(-0.78, y, -0.74, y);
                g.line(0.74, y, 0.78, y);
              }
            });
            // Fireplace hearth & coffee-table game-night tray in warm brass
            g.accent(() => {
              g.rrect(0, -0.71, 0.26, 0.07, 0.01);
              g.rrect(0.02, 0.02, 0.22, 0.12, 0.02);
            });
          }
        }
      ]
    },
    {
      min: 4,
      tier: 4,
      items: [
        {
          id: 'sedan_car',
          label: 'Four-Door Sedan',
          headline(n) {
            return 'Just ' + n + ' of you left on Earth — enough to carpool in one four-door sedan.';
          },
          sub: 'One more real fact seals your 1-of-1 card.',
          draw(g) {
            // 4 Tire treads & aerodynamic side wing mirrors
            g.sub(() => {
              g.rrect(-0.46, -0.54, 0.06, 0.24, 0.02);
              g.rrect(0.46, -0.54, 0.06, 0.24, 0.02);
              g.rrect(-0.46, 0.52, 0.06, 0.24, 0.02);
              g.rrect(0.46, 0.52, 0.06, 0.24, 0.02);
              g.poly([[-0.44, -0.28], [-0.56, -0.25], [-0.55, -0.20], [-0.44, -0.22]], true);
              g.poly([[0.44, -0.28], [0.56, -0.25], [0.55, -0.20], [0.44, -0.22]], true);
            });
            // Sculpted 4-Door Touring Sedan body
            g.wash(() =>
              g.sym(
                [
                  [0, -0.94], [0.28, -0.90], [0.42, -0.76], [0.45, -0.34],
                  [0.46, 0.44], [0.42, 0.80], [0.30, 0.91], [0, 0.93]
                ],
                true
              )
            );
            // Curved front windshield, greenhouse roof, rear glass & interior cabin cutaway!
            g.contour(() => {
              // Windshield
              g.poly(
                [
                  [-0.36, -0.34], [0, -0.42], [0.36, -0.34],
                  [0.31, -0.14], [0, -0.18], [-0.31, -0.14]
                ],
                true
              );
              // Rear backlight glass
              g.poly(
                [
                  [-0.31, 0.46], [0, 0.44], [0.31, 0.46],
                  [0.35, 0.64], [0, 0.68], [-0.35, 0.64]
                ],
                true
              );
              // Greenhouse side window rails
              g.line(-0.36, -0.34, -0.35, 0.64);
              g.line(0.36, -0.34, 0.35, 0.64);
            });
            // 2 Front Bucket Seats, Center Console, Steering Wheel & 3-Seat Rear Bench!
            g.sub(() => {
              g.rrect(-0.18, -0.02, 0.20, 0.20, 0.04); // Driver seat
              g.rrect(0.18, -0.02, 0.20, 0.20, 0.04);  // Passenger seat
              g.rrect(0, 0.30, 0.58, 0.20, 0.04);      // Rear 3-seat bench
            });
            g.inner(() => {
              // Hood character creases, headlights, taillights & B-pillar cutlines
              g.line(-0.22, -0.88, -0.34, -0.40);
              g.line(0.22, -0.88, 0.34, -0.40);
              g.poly([[-0.40, -0.78], [-0.24, -0.88], [-0.22, -0.82], [-0.38, -0.72]], true);
              g.poly([[0.40, -0.78], [0.24, -0.88], [0.22, -0.82], [0.38, -0.72]], true);
              g.line(-0.45, 0.12, -0.31, 0.12);
              g.line(0.31, 0.12, 0.45, 0.12);
              g.rrect(0, -0.02, 0.09, 0.28, 0.02); // Center console
              // Headrests
              g.rrect(-0.18, 0.06, 0.12, 0.05, 0.02);
              g.rrect(0.18, 0.06, 0.12, 0.05, 0.02);
              g.rrect(-0.19, 0.38, 0.11, 0.05, 0.02);
              g.rrect(0, 0.38, 0.11, 0.05, 0.02);
              g.rrect(0.19, 0.38, 0.11, 0.05, 0.02);
            });
            // Steering wheel & front grille emblem in warm brass
            g.accent(() => {
              g.ellipse(-0.18, -0.18, 0.065, 0.035);
              g.rrect(0, -0.90, 0.26, 0.04, 0.01);
            });
          }
        },
        {
          id: 'wooden_rowboat',
          label: 'Wooden Rowboat',
          headline(n) {
            return 'Just ' + n + ' of you left on Earth — everyone fits inside one wooden rowboat.';
          },
          sub: 'Two oars and one final fact between you and 1-of-1.',
          draw(g) {
            // Concentric water ripple rings around the dipping oar blades & bow wake
            g.fine(() => {
              g.ellipse(-0.82, 0.24, 0.13, 0.07, -0.35);
              g.ellipse(-0.82, 0.24, 0.20, 0.11, -0.35);
              g.ellipse(0.82, 0.24, 0.13, 0.07, 0.35);
              g.ellipse(0.82, 0.24, 0.20, 0.11, 0.35);
              g.quad(-0.18, -0.68, -0.44, -0.18, -0.48, 0.42);
              g.quad(0.18, -0.68, 0.44, -0.18, 0.48, 0.42);
            });
            // Classic Whitehall clinker-built wooden rowboat hull + double gunwale
            g.wash(() =>
              g.sym(
                [
                  [0, -0.92], [0.18, -0.64], [0.34, -0.22], [0.38, 0.18],
                  [0.32, 0.66], [0.22, 0.88], [0, 0.88]
                ],
                true
              )
            );
            g.contour(() => {
              g.sym(
                [
                  [0, -0.83], [0.15, -0.58], [0.29, -0.20], [0.33, 0.18],
                  [0.27, 0.63], [0.18, 0.83], [0, 0.83]
                ],
                true
              );
              // Bow breasthook + 3 wooden thwart benches + curved stern sheets bench
              g.poly([[0, -0.83], [0.13, -0.62], [-0.13, -0.62]], true);
              g.rrect(0, -0.32, 0.54, 0.10, 0.01);
              g.rrect(0, 0.08, 0.64, 0.11, 0.01);
              g.rrect(0, 0.48, 0.54, 0.10, 0.01);
              g.poly([[-0.22, 0.68], [0.22, 0.68], [0.18, 0.83], [-0.18, 0.83]], true);
            });
            // Longitudinal bottom floorboards & hull rib frames
            g.inner(() => {
              for (let x = -0.12; x <= 0.13; x += 0.06) {
                g.line(x, -0.58, x, 0.66);
              }
            });
            // Two full sculpted wooden oars in bronze oarlocks (grips, shafts & spoon blades!)
            g.accent(() => {
              g.circle(-0.35, -0.04, 0.024); // Port oarlock
              g.circle(0.35, -0.04, 0.024);  // Starboard oarlock
              g.line(-0.08, -0.14, -0.74, 0.20);
              g.ellipse(-0.82, 0.24, 0.11, 0.036, -0.48);
              g.line(0.08, -0.14, 0.74, 0.20);
              g.ellipse(0.82, 0.24, 0.11, 0.036, 0.48);
            });
          }
        },
        {
          id: 'diner_booth',
          label: 'Corner Diner Booth',
          headline(n) {
            return 'Just ' + n + ' of you left — everyone slides into a single corner diner booth.';
          },
          sub: 'Add one unmistakable truth to claim the whole booth yourself.',
          draw(g) {
            // Retro chrome corner diner booth alcove with ribbed glass-block window on left
            g.wash(() => g.rrect(0, 0, 1.64, 1.46, 0.10));
            // Two facing channel-tufted vinyl bench booths + central Formica table!
            g.contour(() => {
              // Top booth (backrest + seat cushion)
              g.rrect(0.04, -0.48, 1.32, 0.34, 0.06);
              g.line(-0.60, -0.52, 0.68, -0.52);
              // Bottom booth (backrest + seat cushion)
              g.rrect(0.04, 0.48, 1.32, 0.34, 0.06);
              g.line(-0.60, 0.52, 0.68, 0.52);
              // Cantilevered Formica table with rounded chrome edge
              g.rrect(0.06, 0, 1.18, 0.44, 0.07);
            });
            // 4 Diner place settings (oval platters, coffee mugs & silverware) + window block mullion
            g.sub(() => {
              g.rrect(-0.76, 0, 0.07, 1.24, 0.02); // Diner exterior window sill
              const spots = [[-0.18, -0.11], [0.34, -0.11], [-0.18, 0.11], [0.34, 0.11]];
              for (let i = 0; i < spots.length; i++) {
                g.ellipse(spots[i][0], spots[i][1], 0.10, 0.065);
              }
            });
            // Stitched vinyl channel pleats on both booths + coffee mugs
            g.inner(() => {
              for (let x = -0.46; x <= 0.56; x += 0.17) {
                g.line(x, -0.64, x, -0.32);
                g.line(x, 0.32, x, 0.64);
              }
              g.circle(-0.04, -0.11, 0.025);
              g.circle(0.48, -0.11, 0.025);
              g.circle(-0.04, 0.11, 0.025);
              g.circle(0.48, 0.11, 0.025);
            });
            // Wall-mounted mini tabletop Jukebox & napkin caddy in warm brass!
            g.accent(() => {
              g.rrect(-0.44, 0, 0.11, 0.18, 0.02);
              g.rrect(-0.32, 0, 0.06, 0.10, 0.01);
            });
          }
        }
      ]
    },
    {
      min: 2,
      tier: 4,
      items: [
        {
          id: 'park_bench',
          label: 'Park Bench for Two',
          headline(n) {
            return n === 2
              ? 'Just you and ONE statistical twin sharing a single park bench.'
              : 'Down to ' + n + ' of you across 8.3 billion — crowded onto one park bench.';
          },
          sub: 'One final truth makes it unmistakably you.',
          draw(g) {
            // Landscaped garden walkway, cobblestone border & flanking shade-tree canopies + lamp post!
            g.fine(() => {
              g.scallopRing(-0.74, -0.58, 0.22, 0.22, 9, 0.14, true);
              g.scallopRing(0.76, -0.54, 0.20, 0.20, 8, 0.14, true);
              g.line(-0.94, 0.44, 0.94, 0.44);
              g.line(-0.94, 0.78, 0.94, 0.78);
              for (let x = -0.84; x <= 0.85; x += 0.24) {
                g.rrect(x, 0.61, 0.18, 0.22, 0.03); // Paving flagstones
              }
            });
            // Classic Cast-Iron & Teak-Slat Park Bench
            g.wash(() => g.rrect(0, 0.02, 1.52, 0.72, 0.08));
            // Scrolled cast-iron armrests, central divider frame & angled slatted backrest
            g.contour(() => {
              g.rrect(-0.72, 0.02, 0.09, 0.68, 0.03); // Left cast-iron end frame
              g.rrect(0.72, 0.02, 0.09, 0.68, 0.03);  // Right cast-iron end frame
              g.rrect(0, -0.24, 1.35, 0.16, 0.03);    // Backrest assembly
            });
            // 5 Individual hardwood seat slats + carriage-bolt lines!
            g.inner(() => {
              for (let y = -0.10; y <= 0.31; y += 0.10) {
                g.rrect(0, y, 1.34, 0.065, 0.01);
              }
              g.line(-0.34, -0.32, -0.34, 0.36); // Cast-iron under-straps
              g.line(0.34, -0.32, 0.34, 0.36);
            });
            // Victorian park lamp post beside the bench in warm brass
            g.accent(() => {
              g.circle(0.84, 0.02, 0.065);
              g.circle(0.84, 0.02, 0.022);
            });
          }
        },
        {
          id: 'bistro_for_two',
          label: 'Sidewalk Bistro Table',
          headline(n) {
            return n === 2
              ? 'Just you and one statistical double across a tiny sidewalk bistro table.'
              : 'Down to ' + n + ' of you gathered around a tiny sidewalk bistro table.';
          },
          sub: 'One last fact settles the check.',
          draw(g) {
            // Parisian sidewalk paving grid & café window flower-box ledge across top
            g.fine(() => {
              g.rrect(0, -0.82, 1.64, 0.12, 0.02);
              for (let x = -0.72; x <= 0.73; x += 0.36) {
                g.line(x, -0.72, x, 0.86);
              }
              for (let y = -0.44; y <= 0.76; y += 0.40) {
                g.line(-0.88, y, 0.88, y);
              }
            });
            // Two Classic French Bentwood Rattan Bistro Chairs facing across the round table!
            g.sub(() => {
              g.circle(-0.62, 0.04, 0.21); // Left woven seat
              g.circle(0.62, 0.04, 0.21);  // Right woven seat
            });
            g.contour(() => {
              // Curved bentwood hoop backs
              g.arc(-0.62, 0.04, 0.26, Math.PI * 0.52, Math.PI * 1.48);
              g.arc(-0.62, 0.04, 0.23, Math.PI * 0.56, Math.PI * 1.44);
              g.arc(0.62, 0.04, 0.26, -Math.PI * 0.48, Math.PI * 0.48);
              g.arc(0.62, 0.04, 0.23, -Math.PI * 0.44, Math.PI * 0.44);
            });
            // Marble-top brass-rimmed Parisian guéridon table
            g.wash(() => g.circle(0, 0.04, 0.46));
            // Rattan weave hatch & intimate table setting for two (espresso cups, saucers & croissant plate!)
            g.inner(() => {
              g.circle(0, 0.04, 0.41);
              for (let d = -0.12; d <= 0.13; d += 0.08) {
                g.line(-0.76, 0.04 + d, -0.48, 0.04 + d);
                g.line(0.48, 0.04 + d, 0.76, 0.04 + d);
              }
              // Two saucers + espresso cups & handles
              g.circle(-0.22, 0.06, 0.09);
              g.circle(-0.22, 0.06, 0.048);
              g.circle(0.22, 0.06, 0.09);
              g.circle(0.22, 0.06, 0.048);
              // Shared pastry plate
              g.ellipse(0, 0.22, 0.10, 0.07);
            });
            // Brass table rim & tiny center bud vase
            g.accent(() => {
              g.circle(0, -0.10, 0.045);
              g.circle(0, -0.10, 0.016);
            });
          }
        },
        {
          id: 'tandem_canoe',
          label: 'Tandem Canoe',
          headline(n) {
            return n === 2
              ? 'Just you and one statistical twin paddling a tandem canoe.'
              : 'Down to ' + n + ' of you balanced inside a single canoe.';
          },
          sub: 'One more truth makes you 1-of-1.',
          draw(g) {
            // Bow feather-wake & twin paddle eddy swirls in calm lake water
            g.fine(() => {
              g.quad(-0.12, -0.78, -0.44, -0.18, -0.52, 0.72);
              g.quad(0.12, -0.78, 0.44, -0.18, 0.52, 0.72);
              g.circle(-0.80, 0.02, 0.09);
              g.circle(0.80, 0.48, 0.09);
            });
            // Cedar-strip Tandem Canoe double-pointed hull + ash gunwales
            g.wash(() =>
              g.sym(
                [
                  [0, -0.95], [0.16, -0.66], [0.30, -0.28], [0.33, 0],
                  [0.30, 0.28], [0.16, 0.66], [0, 0.95]
                ],
                true
              )
            );
            g.contour(() => {
              g.sym(
                [
                  [0, -0.86], [0.13, -0.60], [0.25, -0.26], [0.28, 0],
                  [0.25, 0.26], [0.13, 0.60], [0, 0.86]
                ],
                true
              );
              // Bow & stern triangular wood decks
              g.poly([[0, -0.95], [0.12, -0.68], [-0.12, -0.68]], true);
              g.poly([[0, 0.95], [0.12, 0.68], [-0.12, 0.68]], true);
              // Woven-cane bow seat, sculpted center ash portage yoke & stern seat!
              g.rrect(0, -0.42, 0.36, 0.11, 0.01);
              g.rrect(0, 0, 0.54, 0.06, 0.02); // Portage yoke
              g.rrect(0, 0.46, 0.34, 0.11, 0.01);
            });
            // Cedar hull rib frames & cane seat weave
            g.inner(() => {
              for (let y = -0.56; y <= 0.57; y += 0.14) {
                if (Math.abs(y) < 0.05 || Math.abs(y + 0.42) < 0.06 || Math.abs(y - 0.46) < 0.06) continue;
                const hw = 0.26 * Math.cos((y / 0.88) * Math.PI * 0.5);
                g.line(-hw, y, hw, y);
              }
            });
            // Two single-blade wooden canoe paddles (T-grips, shafts & beaver-tail blades!)
            g.accent(() => {
              // Bow paddler (port side)
              g.line(0.06, -0.34, -0.68, -0.02);
              g.line(0.04, -0.38, 0.08, -0.30); // T-grip
              g.ellipse(-0.77, 0.02, 0.12, 0.042, -0.40);
              // Stern paddler (starboard side)
              g.line(-0.06, 0.14, 0.68, 0.44);
              g.line(-0.08, 0.18, -0.04, 0.10); // T-grip
              g.ellipse(0.77, 0.48, 0.12, 0.042, 0.38);
            });
          }
        }
      ]
    },

    // --- TIER 5 · SINGULAR (1 · One-of-One) ---
    {
      min: 1,
      tier: 5,
      items: [
        {
          id: 'museum_plinth',
          label: 'Specimen Plinth',
          headline: 'Population: 1. Nobody else on Earth shares this exact combination.',
          sub: 'Standing solo on the specimen plinth — verified One-of-One.',
          draw(g) {
            // Stepped marble specimen pedestal with 72 precision vernier degree graduations!
            g.wash(() => g.circle(0, 0, 0.90), true);
            g.contour(() => {
              g.circle(0, 0, 0.78);
              g.circle(0, 0, 0.62);
            });
            g.inner(() => {
              g.spokes(0.78, 0.86, 72);
              g.spokes(0.62, 0.78, 12);
            });
            // 4 Cardinal brass compass pointers
            g.accent(() => {
              for (let i = 0; i < 4; i++) {
                const a = (i / 4) * TAU;
                const ca = Math.cos(a);
                const sa = Math.sin(a);
                const tx = -sa * 0.045;
                const ty = ca * 0.045;
                g.poly(
                  [
                    [ca * 0.96, sa * 0.96],
                    [ca * 0.84 - tx, sa * 0.84 - ty],
                    [ca * 0.84 + tx, sa * 0.84 + ty]
                  ],
                  true
                );
              }
            });
          }
        },
        {
          id: 'spotlight_iris',
          label: 'Center Stage Spotlight',
          headline: 'Population: 1. Nobody else on Earth shares this exact combination.',
          sub: 'Center stage in a solo spotlight — verified One-of-One.',
          draw(g) {
            // Precision 12-blade optical iris diaphragm inside calibrated brass lens bezel!
            g.wash(() => g.circle(0, 0, 0.90), true);
            g.contour(() => {
              g.circle(0, 0, 0.80);
              g.circle(0, 0, 0.56);
            });
            // 12 tangential overlapping iris diaphragm blades!
            g.sub(() => {
              for (let i = 0; i < 12; i++) {
                const a0 = (i / 12) * TAU;
                const a1 = a0 + 0.78;
                g.line(Math.cos(a0) * 0.56, Math.sin(a0) * 0.56, Math.cos(a1) * 0.80, Math.sin(a1) * 0.80);
              }
            });
            g.inner(() => g.spokes(0.80, 0.87, 36));
            // 4 Corner theatrical framing brackets
            g.accent(() => {
              const c = 0.74;
              const s = 0.16;
              g.poly([[-c, -c + s], [-c, -c], [-c + s, -c]], false);
              g.poly([[c - s, -c], [c, -c], [c, -c + s]], false);
              g.poly([[c, c - s], [c, c], [c - s, c]], false);
              g.poly([[-c + s, c], [-c, c], [-c, c - s]], false);
            });
          }
        },
        {
          id: 'zenith_aperture',
          label: 'Observatory Zenith',
          headline: 'Population: 1. Nobody else on Earth shares this exact combination.',
          sub: 'Centered in the observatory zenith — verified One-of-One.',
          draw(g) {
            // Great Observatory rotating dome zenith oculus with twin shutter rails!
            g.wash(() => g.circle(0, 0, 0.90), true);
            g.contour(() => {
              g.circle(0, 0, 0.76);
              // Twin parallel dome shutter tracks opening onto the sky
              g.line(-0.28, -0.85, -0.28, -0.52);
              g.line(0.28, -0.85, 0.28, -0.52);
              g.line(-0.28, 0.52, -0.28, 0.85);
              g.line(0.28, 0.52, 0.28, 0.85);
            });
            g.inner(() => {
              g.spokes(0.76, 0.88, 24);
              g.arc(0, 0, 0.62, -0.35, 0.35);
              g.arc(0, 0, 0.62, Math.PI - 0.35, Math.PI + 0.35);
            });
            // 4 Spider-vane secondary mirror struts & RA vernier indices
            g.accent(() => {
              g.spokes(0.56, 0.94, 4, Math.PI * 0.25);
              g.circle(0, 0, 0.56);
            });
          }
        }
      ]
    }
  ];

  // Flatten catalog for quick ID lookup & test inspection
  const ALL_OUTLINES = [];
  for (let bIdx = 0; bIdx < BANDS.length; bIdx++) {
    const band = BANDS[bIdx];
    for (let i = 0; i < band.items.length; i++) {
      const item = band.items[i];
      item.bandIndex = bIdx;
      item.bandSize = band.items.length;
      item.minPop = band.min;
      item.tier = band.tier;
      ALL_OUTLINES.push(item);
    }
  }

  function findBand(population, isOneOfOne) {
    if (isOneOfOne || population <= 1) {
      return BANDS[BANDS.length - 1];
    }
    const pop = Math.max(2, Math.round(Number(population) || 8300000000));
    for (let i = 0; i < BANDS.length - 1; i++) {
      if (pop >= BANDS[i].min) {
        return BANDS[i];
      }
    }
    return BANDS[BANDS.length - 2];
  }

  /**
   * Resolves a perspective outline for `(population, isOneOfOne)`, always starting
   * on the Planetary Globe at 8.3B and rotating smoothly across sibling outlines below 8B.
   */
  function resolveOutline(population, isOneOfOne, opts) {
    const o = opts || {};
    const band = findBand(population, isOneOfOne);
    const items = band.items;
    const len = items.length;
    if (len === 1) return items[0];

    const runSeed = Math.max(0, Number(o.runSeed) || 0);
    const stepCount = Math.max(0, Number(o.stepCount) || 0);
    const cycleOffset = Math.max(0, Number(o.cycleOffset) || 0);

    let idx = (runSeed * 3 + stepCount + cycleOffset) % len;

    if (o.avoidId && len > 1 && items[idx].id === o.avoidId) {
      idx = (idx + 1) % len;
    }

    return items[idx];
  }

  /**
   * Returns the 1-to-1 matched `{ headline, sub }` for `outline` at `population`.
   */
  function getCopyForOutline(outline, population) {
    if (!outline) {
      return { headline: '', sub: '' };
    }
    const pop = Math.max(1, Math.round(Number(population) || 1));
    const headline =
      typeof outline.headline === 'function' ? outline.headline(pop) : outline.headline || '';
    const sub = typeof outline.sub === 'function' ? outline.sub(pop) : outline.sub || '';
    return { headline, sub };
  }

  /**
   * Renders an outline centered at `(cx, cy)` with pixel radius `S`, opacity `alpha`,
   * and continuous animation clock `timeSec` (used by the spinning Planetary Globe).
   */
  function drawOutline(ctx, outline, cx, cy, S, alpha, timeSec) {
    if (!ctx || !outline || typeof outline.draw !== 'function' || alpha <= 0.005) return;
    const pen = createBlueprintPen(ctx, cx, cy, S, alpha);
    outline.draw(pen, timeSec || 0);
  }

  return {
    BANDS,
    ALL_OUTLINES,
    findBand,
    resolveOutline,
    getCopyForOutline,
    drawOutline
  };
});
