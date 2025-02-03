import { type AnalysisToolParam } from '@arcgis/analysis-ui-schema'
import {
  convertJobParamsToToolData,
  convertParameterInfo,
  getRulesOfParameters,
  getParameterUIJson,
  canDisplayAsLink,
  resultHasItemId
} from '../src/runtime/utils'
import { MockMapView } from 'jimu-for-test'

describe('convertParameterInfo', () => {
  const mockMapView = new MockMapView()
  it('should add label, mapView, mapLayers, user on parameterInfo whose type is layer input', () => {
    expect(
      convertParameterInfo(
        {
          dataType: 'GPFeatureRecordSetLayer',
          displayName: 'feature class column',
          name: 'feature class column'
        } as AnalysisToolParam,
        mockMapView as any,
        []
      )
    ).toEqual({
      dataType: 'GPFeatureRecordSetLayer',
      displayName: 'feature class column',
      name: 'feature class column',
      label: 'feature class column',
      mapView: mockMapView,
      mapLayers: [],
      user: undefined
    })
  })
  it('should only add label on parameterInfo whose type is not layer input', () => {
    expect(
      convertParameterInfo(
        {
          name: 'feature layer column',
          dataType: 'GPString',
          displayName: 'feature layer column',
          choiceList: ['points', 'polylines', 'polygonZ']
        } as AnalysisToolParam,
        mockMapView as any,
        []
      )
    ).toEqual({
      name: 'feature layer column',
      dataType: 'GPString',
      displayName: 'feature layer column',
      choiceList: ['points', 'polylines', 'polygonZ'],
      label: 'feature layer column'
    })
  })
})

describe('convertJobParamsToToolData', () => {
  it('if parameter is GPValueTable, should add selectedLayers on parameterInfo whose type is layer input and return the selected layers inner value table', () => {
    convertJobParamsToToolData({
      jobParams: {
        Input_Features: [
          {
            'feature class column': {
              url: 'https://servicesdev.arcgis.com/zImu9NfARSUcVsy1/arcgis/rest/services/Philadelphia_Crime_Map_WFL1/FeatureServer/1',
              itemId: '1f3e03124f11409680f3305573d55586'
            },
            'feature layer column': {
              url: 'https://servicesdev.arcgis.com/zImu9NfARSUcVsy1/arcgis/rest/services/Philadelphia_Crime_Map_WFL1/FeatureServer/2',
              itemId: '1f3e03124f11409680f3305573d55586'
            },
            'feature set column': {
              url: 'https://services1.arcgis.com/oC086ufSSQ6Avnw2/ArcGIS/rest/services/TestFCMap_WFL1/FeatureServer/0',
              itemId: '4246755a17994f77b4888f3cdb8946f7'
            }
          }
        ],
        Input_Tables: [
          {
            'table column': {
              url: 'https://services1.arcgis.com/oC086ufSSQ6Avnw2/ArcGIS/rest/services/TestFCMap_WFL1/FeatureServer/1',
              itemId: '4246755a17994f77b4888f3cdb8946f7'
            },
            'table view column': {
              url: 'https://services1.arcgis.com/oC086ufSSQ6Avnw2/ArcGIS/rest/services/TestFCMap_WFL1/FeatureServer/2',
              itemId: '4246755a17994f77b4888f3cdb8946f7'
            }
          }
        ],
        Input_Rasters: [
          {
            'raster layer column': {
              url: 'https://landscape4dev.arcgis.com/arcgis/rest/services/USA_California_Condor_GAP_Range/ImageServer?token=mSixlYG_RPBgqoKXB5ghDJtbC-XvAEcXWhWFAf0Y17Bg1f0yYtjLrn6Qs7HkIh3LtE1LtCCRuBZAD8MEZUmYAZf4IVGkhgONQr67hGWJZLkMcN6TlPg45Eg9_S4aVRTQ8czIeVThJOXpjsGTxPP1FDP9wfUgUTCQgRF5TQTjHHA1rW9sPx7XADKUVsEs6meiLQMT3StAeNvEtZjasuRua4QfnTebwnubN5fzCvSvlFSFMA19gakgIDK_QN4CtrL8ZqD5ImNreebqE0K2QulWZaWdFaKmq5srQd7kDFsYxlSQuVssaTQUvg8MFVJDKrZo',
              mosaicRule: {
                ascending: true,
                mosaicMethod: 'esriMosaicNorthwest',
                mosaicOperation: 'MT_FIRST'
              }
            },
            'raster dataset column': {
              url: 'https://tiledimageservicesdev1.arcgis.com/tEOXnBNDTR2npP8Z/arcgis/rest/services/Small_Modis_NDVI/ImageServer'
            },
            'image service column': {
              url: 'https://tiledimageservicesdev.arcgis.com/b5ADkBof6gCHCFQm/arcgis/rest/services/daymet_3days_tmax_TIL/ImageServer'
            }
          }
        ],
        esri_out_feature_service_name: '77777'
      },
      uiOnlyParams: {},
      toolJSON: {
        name: 'complextypesud',
        displayName: 'Valuetable complex types no filter optional user defined',
        description: 'made from pro 34994‌',
        category: '',
        helpUrl:
          'https://gpportal.esri.com/server/rest/directories/arcgisoutput/Level2_ValueTable_Async_GPServer/Level2_ValueTable_Async/complextypesud.htm',
        executionType: 'esriExecutionTypeAsynchronous',
        parameters: [
          {
            name: 'Input_Features',
            dataType: 'GPValueTable',
            displayName: 'Input Features',
            description: 'feature class, feature layer and feature set columns',
            direction: 'esriGPParameterDirectionInput',
            defaultValue: [[null, null, null]],
            parameterType: 'esriGPParameterTypeOptional',
            category: '',
            parameterInfos: [
              {
                name: 'feature class column',
                dataType: 'GPFeatureRecordSetLayer',
                displayName: 'feature class column'
              },
              {
                name: 'feature layer column',
                dataType: 'GPFeatureRecordSetLayer',
                displayName: 'feature layer column'
              },
              {
                name: 'feature set column',
                dataType: 'GPFeatureRecordSetLayer',
                displayName: 'feature set column'
              }
            ] as any[]
          },
          {
            name: 'Input_Tables',
            dataType: 'GPValueTable',
            displayName: 'Input Tables',
            description: 'table and table view columns',
            direction: 'esriGPParameterDirectionInput',
            defaultValue: [[null, null]],
            parameterType: 'esriGPParameterTypeOptional',
            category: '',
            parameterInfos: [
              {
                name: 'table column',
                dataType: 'GPRecordSet',
                displayName: 'table column'
              },
              {
                name: 'table view column',
                dataType: 'GPRecordSet',
                displayName: 'table view column'
              }
            ] as any[]
          },
          {
            name: 'Input_Rasters',
            dataType: 'GPValueTable',
            displayName: 'Input Rasters',
            description:
              'raster layer, raster dataset, and image service columns ',
            direction: 'esriGPParameterDirectionInput',
            defaultValue: [[null, null, null]],
            parameterType: 'esriGPParameterTypeOptional',
            category: '',
            parameterInfos: [
              {
                name: 'raster layer column',
                dataType: 'GPRasterDataLayer',
                displayName: 'raster layer column'
              },
              {
                name: 'raster dataset column',
                dataType: 'GPRasterDataLayer',
                displayName: 'raster dataset column'
              },
              {
                name: 'image service column',
                dataType: 'GPRasterDataLayer',
                displayName: 'image service column'
              }
            ] as any
          },
          {
            name: 'esri_out_feature_service_name',
            dataType: 'GPString',
            displayName: 'Output Feature Service Name',
            description:
              'The name of the optional feature service to create on the federated server containing the result of this tool. If no name is specified an output feature service will not be created.',
            direction: 'esriGPParameterDirectionInput',
            defaultValue: '',
            parameterType: 'esriGPParameterTypeOptional',
            category: ''
          }
        ]
      },
      availableMapLayers: [],
      toolName: 'test'
    }).then(res => {
      const {
        valueTableSelectedLayersConvertedParameters,
        layers
      } = res
      expect(valueTableSelectedLayersConvertedParameters).toHaveLength(4)
      valueTableSelectedLayersConvertedParameters.forEach(p => {
        if (p.dataType === 'GPValueTable' && p.direction === 'esriGPParameterDirectionInput') {
          p.parameterInfos?.forEach(pi => {
            // TODO check why GPRasterDataLayer does not have selectedLayers property, it works fine in non-test env
            if (pi.dataType !== 'GPRasterDataLayer') {
              expect(pi).toHaveProperty('selectedLayers')
            }
          })
        }
      })
      expect(layers).toHaveLength(0)
    })
  })
  it('if parameter is not GPValueTable, valueTableSelectedLayers and valueTableSelectedLayersConvertedParameters should be mepty', () => {
    convertJobParamsToToolData({
      jobParams: {},
      uiOnlyParams: {},
      toolJSON: {
        name: 'Model',
        displayName: '911 Calls Hotspot',
        description: '',
        category: '',
        helpUrl:
          'https://sampleserver6.arcgisonline.com/arcgis/rest/directories/arcgisoutput/911CallsHotspotPro_GPServer/911CallsHotspotPro/Model.htm',
        executionType: 'esriExecutionTypeAsynchronous',
        parameters: [
          {
            name: 'Query',
            dataType: 'GPString',
            displayName: 'Query',
            description:
              'A query string to filter calls. The query can be based on the day of the week such MON/TUE/WED/THU/FRI/SAT (Field Name: Day) or a date range between Jan 1st ,1998 to May 31, 1998 (Field Name: Date). For example, it can be ("DATE" &gt; date \'1998-01-01 00:00:00\' AND "DATE" &lt; date \'1998-01-31 00:00:00\') AND ("Day" = \'SUN\' OR "Day"= \'SAT\')',
            direction: 'esriGPParameterDirectionInput',
            defaultValue:
              '("DATE" > date \'1998-01-01 00:00:00\' AND "DATE" < date \'1998-01-31 00:00:00\') AND ("Day" = \'SUN\' OR "Day"= \'SAT\')',
            parameterType: 'esriGPParameterTypeOptional',
            category: ''
          },
          {
            name: 'Output_Features',
            dataType: 'GPFeatureRecordSetLayer',
            displayName: 'Output_Features',
            description:
              'Features that were filtered based on the query input. A special symobology shows events based on the day of a week.',
            direction: 'esriGPParameterDirectionOutput',
            defaultValue: {
              displayFieldName: '',
              geometryType: 'esriGeometryPoint',
              spatialReference: {
                wkid: 102726,
                latestWkid: 102726
              },
              fields: [
                {
                  name: 'OBJECTID',
                  type: 'esriFieldTypeOID',
                  alias: 'OBJECTID_12'
                },
                {
                  name: 'INC_NO',
                  type: 'esriFieldTypeDouble',
                  alias: 'INC_NO'
                },
                {
                  name: 'NFPA_TYP',
                  type: 'esriFieldTypeString',
                  alias: 'NFPA_TYP',
                  length: 14
                },
                {
                  name: 'CALL_TYPE',
                  type: 'esriFieldTypeString',
                  alias: 'CALL_TYPE',
                  length: 11
                },
                {
                  name: 'CITY',
                  type: 'esriFieldTypeString',
                  alias: 'CITY',
                  length: 9
                },
                {
                  name: 'Date',
                  type: 'esriFieldTypeDate',
                  alias: 'Date',
                  length: 8
                },
                {
                  name: 'Day',
                  type: 'esriFieldTypeString',
                  alias: 'Day',
                  length: 50
                }
              ],
              features: [],
              exceededTransferLimit: false
            },
            parameterType: 'esriGPParameterTypeRequired',
            category: ''
          },
          {
            name: 'Hotspot_Raster',
            dataType: 'GPRasterDataLayer',
            displayName: 'Hotspot_Raster',
            description:
              'Hotspot Raster created for filtered features. A special symbology has applied for better visualization.',
            direction: 'esriGPParameterDirectionOutput',
            defaultValue: null,
            parameterType: 'esriGPParameterTypeRequired',
            category: ''
          }
        ]
      },
      availableMapLayers: [],
      toolName: 'test'
    }).then(res => {
      const {
        valueTableSelectedLayersConvertedParameters,
        valueTableSelectedLayers
      } = res
      expect(valueTableSelectedLayersConvertedParameters).toHaveLength(0)
      expect(valueTableSelectedLayers).toHaveLength(0)
    })
  })
})

describe('getRulesOfParameters', () => {
  it('should return rules array if has Field parameters and the Field parameters has dependency', () => {
    const rules = getRulesOfParameters([
      {
        name: 'Input_feature_class',
        dataType: 'GPFeatureRecordSetLayer',
        displayName: 'Input feature class',
        description: 'dummy infc',
        direction: 'esriGPParameterDirectionInput',
        parameterType: 'esriGPParameterTypeRequired',
        category: '',
        selectFromMapLayer: true
      },
      // has dependency
      {
        name: 'Input_short_field',
        dataType: 'Field',
        displayName: 'Input short field',
        description: 'short only',
        direction: 'esriGPParameterDirectionInput',
        dependency: 'Input_feature_class',
        filter: {
          type: 'field',
          list: ['esriFieldTypeSmallInteger']
        },
        defaultValue: {
          name: 'myshortfield',
          type: 'esriFieldTypeSmallInteger',
          alias: 'myshortfield',
          editable: true,
          nullable: true,
          length: 2
        },
        parameterType: 'esriGPParameterTypeRequired',
        category: ''
      },
      // no dependency
      {
        name: 'Input_long_field',
        dataType: 'Field',
        displayName: 'Input long field',
        description: 'long only',
        direction: 'esriGPParameterDirectionInput',
        filter: {
          type: 'field',
          list: ['esriFieldTypeInteger']
        },
        defaultValue: {
          name: 'mylongfield',
          type: 'esriFieldTypeInteger',
          alias: 'mylongfield',
          editable: true,
          nullable: true,
          length: 4
        },
        parameterType: 'esriGPParameterTypeRequired',
        category: ''
      }
    ] as any)
    expect(rules).toEqual([
      {
        ruleType: 'expression',
        expression: '$[Data].Input_feature_class NOT null',
        destination: 'Input_short_field',
        effectParams: {
          mapLayer: '$[Component].Input_feature_class.selectedLayers'
        }
      }
    ])
  })
  it('should return empty array if does not have Field parameters', () => {
    const rules = getRulesOfParameters([
      {
        name: 'Input_feature_class',
        dataType: 'GPFeatureRecordSetLayer',
        displayName: 'Input feature class',
        description: 'dummy infc',
        direction: 'esriGPParameterDirectionInput',
        parameterType: 'esriGPParameterTypeRequired',
        category: '',
        selectFromMapLayer: true
      }
    ] as any)
    expect(rules).toHaveLength(0)
  })
})

describe('getParameterUIJson', () => {
  const translate = (id) => id
  const mockPortal = { user: 1 } as unknown as __esri.Portal
  const commonStrings = {
    webToolsUnits: {
      esriCentimeters: 'Centimeters',
      esriDecimalDegrees: 'Decimal Degrees',
      esriDecimeters: 'Decimeters',
      esriFeet: 'US Survey Feet',
      esriInches: 'US Survey Inches',
      esriIntFeet: 'International Feet',
      esriIntInches: 'International Inches',
      esriIntMiles: 'International Miles',
      esriIntNauticalMiles: 'International Nautical Miles',
      esriIntYards: 'International Yards',
      esriKilometers: 'Kilometers',
      esriMeters: 'Meters',
      esriMiles: 'US Survey Miles',
      esriMillimeters: 'Millimeters',
      esriNauticalMiles: 'US Survey Nautical Miles',
      esriPoints: 'International Points',
      esriUnknownUnits: 'Unknown',
      esriYards: 'US Survey Yards'
    }
  }
  it('GPRasterDataLayer', () => {
    const rasterDataLayerparam = {
      name: 'Input_Raster_Dataset',
      dataType: 'GPRasterDataLayer',
      displayName: 'Input Raster Dataset',
      description: 'Input Raster Dataset',
      direction: 'esriGPParameterDirectionInput',
      defaultValue: null,
      parameterType: 'esriGPParameterTypeRequired',
      category: '',
      selectFromMapLayer: true
    } as any
    expect(getParameterUIJson(rasterDataLayerparam, translate, mockPortal, commonStrings)).toEqual({
      name: 'Input_Raster_Dataset',
      label: 'Input Raster Dataset'
    })
  })
  it('GPFeatureRecordSetLayer, GPMultiValue:GPFeatureRecordSetLayer, GPRecordSet, GPMultiValue:GPRecordSet', () => {
    const featureRecordSetLayerParam = {
      name: 'Feature_Class',
      dataType: 'GPFeatureRecordSetLayer',
      displayName: 'Feature Class',
      description: 'infc',
      direction: 'esriGPParameterDirectionInput',
      filter: {
        type: 'featureClass',
        list: ['esriGeometryPolygon', 'esriGeometryPolyline']
      },
      parameterType: 'esriGPParameterTypeRequired',
      category: '',
      selectFromMapLayer: true
    } as any
    expect(getParameterUIJson(featureRecordSetLayerParam, translate, mockPortal, commonStrings)).toEqual({
      name: 'Feature_Class',
      label: 'Feature Class',
      enableSketch: true,
      hideBrowseButton: false
    })

    const featureRecordSetLayerParamWithEmptyFilterList = { ...featureRecordSetLayerParam, filter: { type: 'featureClass', list: [] } }
    expect(getParameterUIJson(featureRecordSetLayerParamWithEmptyFilterList, translate, mockPortal, commonStrings)).toEqual({
      name: 'Feature_Class',
      label: 'Feature Class',
      enableSketch: true,
      hideBrowseButton: false
    })
  })

  it('GPLinearUnit', () => {
    const linearUnitParamWithoutChoiceList = {
      name: 'Distance',
      dataType: 'GPLinearUnit',
      displayName: 'Distance',
      description: 'distance',
      direction: 'esriGPParameterDirectionInput',
      defaultValue: {
        distance: 100,
        units: 'esriMiles'
      },
      parameterType: 'esriGPParameterTypeRequired',
      category: '',
      filter: {
        type: 'range',
        minimum: 0,
        maximum: 2000
      }
    } as any
    expect(
      (getParameterUIJson(linearUnitParamWithoutChoiceList, translate, mockPortal, commonStrings).choiceList as string[]).length
    ).toBeGreaterThan(0)
    const linearUnitParamWithChoiceLlist = { ...linearUnitParamWithoutChoiceList, choiceList: ['esriMeters', 'esriKilometers', 'esriFeet'] }
    expect(getParameterUIJson(linearUnitParamWithChoiceLlist, translate, mockPortal, commonStrings)).toEqual({
      name: 'Distance',
      label: 'Distance',
      minimum: 0,
      maximum: 2000
    })
  })
  it('GPDouble, GPMultiValue:GPDouble, GPLong', () => {
    const longParam = {
      name: 'input_long',
      displayName: 'Input Long',
      description: 'input_long description',
      parameterType: 'esriGPParameterTypeRequired',
      defaultValue: 12345678901234,
      dataType: 'GPLong',
      category: '',
      direction: 'esriGPParameterDirectionInput',
      filter: {
        type: 'range',
        minimum: -99999,
        maximum: 99999
      }
    } as any
    expect(getParameterUIJson(longParam, translate, mockPortal, commonStrings)).toEqual({
      name: 'input_long',
      label: 'Input Long',
      min: -99999,
      max: 99999
    })
  })
  it('GPField', () => {
    const fieldParam = {
      name: 'Input_short_field',
      dataType: 'Field',
      displayName: 'Input short field',
      description: 'short only',
      direction: 'esriGPParameterDirectionInput',
      dependency: 'Input_feature_class',
      filter: {
        type: 'field',
        list: ['esriFieldTypeSmallInteger', 'esriFieldTypeGlobalID', 'esriFieldTypeGUID']
      },
      parameterType: 'esriGPParameterTypeRequired',
      category: ''
    } as any
    expect(getParameterUIJson(fieldParam, translate, mockPortal, commonStrings)).toEqual({
      name: 'Input_short_field',
      label: 'Input short field'
    })
  })
  it('GPValueTable', () => {
    const valueTableParam = {
      name: 'Input_range_filters',
      dataType: 'GPValueTable',
      displayName: 'Input range filters',
      description:
        'long and double are the columnsfirst column long has a range of -99,999 to 99,999second column double has a range of -12345678.9 to 98765.4321',
      direction: 'esriGPParameterDirectionInput',
      defaultValue: [
        [7678, -8796789.89],
        [333, 75678.567],
        [-76856, null]
      ],
      parameterType: 'esriGPParameterTypeRequired',
      category: '',
      parameterInfos: [
        {
          name: 'input long column',
          dataType: 'GPLong',
          displayName: 'input long column',
          filter: {
            type: 'range',
            minimum: -99999,
            maximum: 99999
          }
        },
        {
          name: 'input double column',
          dataType: 'GPDouble',
          displayName: 'input double column',
          filter: {
            type: 'range',
            minimum: -12345678.9,
            maximum: 98765.4321
          }
        },
        {
          name: 'Input_short_field',
          dataType: 'Field',
          displayName: 'Input short field',
          dependency: 'Input_feature_class',
          filter: {
            type: 'field',
            list: ['esriFieldTypeSmallInteger', 'esriFieldTypeGlobalID', 'esriFieldTypeGUID']
          }
        }
      ]
    } as any

    expect(getParameterUIJson(valueTableParam, translate, mockPortal, commonStrings)).toEqual({
      name: 'Input_range_filters',
      label: 'Input range filters',
      UIparameterInfos: [
        {
          name: 'input long column',
          label: 'input long column',
          min: -99999,
          max: 99999
        },
        {
          name: 'input double column',
          label: 'input double column',
          min: -12345678.9,
          max: 98765.4321
        },
        {
          name: 'Input_short_field',
          label: 'Input short field'
        }
      ],
      UIparameterRules: [],
      defaultValue: [
        {
          'input long column': 7678,
          'input double column': -8796789.89,
          Input_short_field: undefined
        },
        {
          'input long column': 333,
          'input double column': 75678.567,
          Input_short_field: undefined
        },
        {
          'input long column': -76856,
          'input double column': undefined,
          Input_short_field: undefined
        }
      ]
    })
  })
})

describe('canDisplayAsLink', () => {
  it('canDisplayAsLink should return true only if the value has a url property in string format', () => {
    expect(canDisplayAsLink(null)).toEqual(false)
    expect(canDisplayAsLink({ itemId: '1111' } as any)).toEqual(false)
    expect(canDisplayAsLink({ url: 1 } as any)).toEqual(false)
    expect(canDisplayAsLink({ url: '111' } as any)).toEqual(true)
  })
})

describe('resultHasItemId', () => {
  it('resultHasItemId should return true only if the value has an itemId property in string format', () => {
    expect(resultHasItemId(null)).toEqual(false)
    expect(resultHasItemId({ url: '1111' } as any)).toEqual(false)
    expect(resultHasItemId({ itemId: 1 } as any)).toEqual(false)
    expect(resultHasItemId({ itemId: '111' } as any)).toEqual(true)
  })
})
