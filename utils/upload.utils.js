import ClientMasterModel from "../models/ClientMasterModel.js";
import OpportunityMasterModel from "../models/OpportunityMasterModel.js";
import TenderMasterModel from "../models/TenderMasterModel.js";
import ContactMasterModel from "../models/ContactMasterModel.js";
import uploadAndGetAvatarUrl from "./uploadAndGetAvatarUrl.utils.js";
import ExcelJS from "exceljs";
import { Readable } from "stream";
import { parse } from "json2csv";
import {
  clientFieldMapping,
  contactFieldMap,
  opportunityFieldMap,
  tenderFieldMap,
  bdFieldMap,
} from "../controllers/upload/fieldMap.js";
import ClassificationModel from "../models/ConfigModels/ClientMaster/ClassificationModel.js";
import IncorporationTypeModel from "../models/ConfigModels/ClientMaster/IncorporationTypeModel.js";
import RelationshipDegreeModel from "../models/ConfigModels/ContactMaster/RelationshipDegreeModel.js";
import RelationshipStatusModel from "../models/ConfigModels/ClientMaster/RelationshipStatusModel.js";
import IndustryMasterModel from "../models/Configuration/IndustryModel.js";
import SubIndustryModel from "../models/Configuration/SubIndustryModel.js";
import TerritoryModel from "../models/Configuration/TerritoryModel.js";
import StaffModel from "../models/StaffModel.js";
import UserModel from "../models/UserModel.js";
import ArchetypeModel from "../models/ConfigModels/ContactMaster/ArchetypeModel.js";
import SolutionMasterModel from "../models/Configuration/SolutionModel.js";
import SalesStageModel from "../models/StageModels/SalesStageModel.js";
import SalesSubStageModel from "../models/StageModels/SalesSubStage.js";
import TenderStageModel from "../models/ConfigModels/TenderMaster/TenderStageModel.js";
import BusinessDevelopmentModel from "../models/BusinessDevelopmentModel.js";

export const getFormattedData = async (bulkData, resource) => {
  const classificationMap = await ClassificationModel.find({}).then(
    (classifications) => {
      return classifications.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    }
  );

  const incorporationTypeMap = await IncorporationTypeModel.find({}).then(
    (types) => {
      return types.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    }
  );

  const relationshipStatusMap = await RelationshipStatusModel.find({}).then(
    (statuses) => {
      return statuses.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    }
  );

  const industryMap = await IndustryMasterModel.find({}).then((industries) => {
    return industries.reduce((acc, item) => {
      acc[item.label] = item._id;
      return acc;
    }, {});
  });

  const subIndustryMap = await SubIndustryModel.find({}).then(
    (industries) => {
      return industries.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    }
  );

  const territoryMap = await TerritoryModel.find({}).then(
    (territories) => {
      return territories.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    }
  );

  // const userMap = await StaffModel.find({}).then((staffs) => {
  //   return staffs.reduce((acc, item) => {
  //     acc[item.firstName + " " + item.lastName] = item._id;
  //     return acc;
  //   }, {});
  // });

  const userMap = await UserModel.find({}).then((users) => {
    return users.reduce((acc, item) => {
      acc[item.firstName + " " + item.lastName] = item._id;
      return acc;
    }, {});
  });

  const archTypeMap = await ArchetypeModel.find({}).then((archType) => {
    return archType.reduce((acc, item) => {
      acc[item.label] = item._id;
      return acc;
    }, {});
  });

  const solutionMap = await SolutionMasterModel.find({}).then((solution) => {
    return solution.reduce((acc, item) => {
      acc[item.label] = item._id;
      return acc;
    }, {});
  });

  const salesStageMap = await SalesStageModel.find({}).then(
    (salesStage) => {
      return salesStage.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    }
  );

  const salesSubStageMap = await SalesSubStageModel.find({}).then(
    (salesSubStage) => {
      return salesSubStage.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    }
  );

  const relationshipDegreeMap = await RelationshipDegreeModel.find({}).then(
    (RSDegrees) => {
      return RSDegrees.reduce((acc, item) => {
        acc[item.label] = item._id;
        return acc;
      }, {});
    }
  );

  const tenderStageMap = await TenderStageModel.find({}).then((tenders) => {
    return tenders.reduce((acc, item) => {
      acc[item.label] = item._id;
      return acc;
    }, {});
  });

  const contactMap = await ContactMasterModel.find({}).then((contacts) => {
    return contacts.reduce((acc, item) => {
      acc[item.firstName + " " + item.lastName] = item._id;
      return acc;
    }, {});
  });

  const clientMap = await ClientMasterModel.find({})
    .select("name")
    .then((clients) => {
      return clients.reduce((acc, item) => {
        acc[item.name] = item._id;
        return acc;
      }, {});
    });

  console.log("contact map----", contactMap);

  let csvToModelMap = null;

  switch (resource) {
    case "client":
      csvToModelMap = clientFieldMapping;
      break;
    case "contact":
      csvToModelMap = contactFieldMap;
      break;
    case "opportunity":
      csvToModelMap = opportunityFieldMap;
      break;
    case "tender":
      csvToModelMap = tenderFieldMap;
      break;
    case "businessDevelopment":
      csvToModelMap = bdFieldMap;
  }

  let analysisResult = {};
  const formattedData = bulkData.map((row, rowIdx) => {
    let formattedRow = {};
    Object.keys(row).forEach((csvField, colIdx) => {
      const modelField = csvToModelMap[csvField];
      if (modelField) {
        switch (modelField) {
          case "classification":
            formattedRow[modelField] = classificationMap[row[csvField]];
            break;
          case "enteredBy":
            formattedRow[modelField] = userMap[row[csvField]];
            console.log("enteredBy csv field ----", row[csvField]);
            break;
          case "incorporationType":
            formattedRow[modelField] = incorporationTypeMap[row[csvField]];
            break;
          case "relationshipStatus":
            formattedRow[modelField] = relationshipStatusMap[row[csvField]];
            break;
          case "listedCompany":
            formattedRow[modelField] = row[csvField] === "Listed";
            break;
          case "entryDate":
            formattedRow[modelField] = new Date(row[csvField]);
            break;
          case "relatedContacts":
            formattedRow[modelField] = null;
            break;
          case "industry":
            formattedRow[modelField] = industryMap[row[csvField]];
            break;
          case "subIndustry":
            formattedRow[modelField] = subIndustryMap[row[csvField]];
            break;
          case "territory":
            formattedRow[modelField] = territoryMap[row[csvField]];
            break;
          case "primaryRelationship":
            formattedRow[modelField] = userMap[row[csvField]];
            break;
          case "secondaryRelationship":
            formattedRow[modelField] = userMap[row[csvField]];
            break;
          case "archeType":
            formattedRow[modelField] = archTypeMap[row[csvField]];
            break;
          case "relationshipDegree":
            formattedRow[modelField] = relationshipDegreeMap[row[csvField]];
            break;
          case "client":
            if (resource == "businessDevelopment") {
              formattedRow[modelField] = clientMap[row[csvField]];
            } else {
              formattedRow[modelField] = null;
            }
            break;
          case "associatedTender":
            formattedRow[modelField] = null; // Implement getTenderIdByName function
            break;
          case "customId":
            formattedRow[modelField] = null; // Implement getTenderIdByName function
            break;
          case "solution":
            formattedRow[modelField] = solutionMap[row[csvField]]; // Implement getSolutionIdByName function
            break;
          case "subSolution":
            formattedRow[modelField] = solutionMap[row[csvField]]; // Implement getSolutionIdByName function
            break;
          case "salesStage":
            formattedRow[modelField] = salesStageMap[row[csvField]]; // Implement getSolutionIdByName function
            break;
          case "salesSubStage":
            formattedRow[modelField] = salesSubStageMap[row[csvField]]; // Implement getSolutionIdByName function
            break;
          case "salesChamp":
            formattedRow[modelField] = userMap[row[csvField]]; // Implement getSolutionIdByName function
            break;
          case "officer":
            formattedRow[modelField] = userMap[row[csvField]]; // Implement getSolutionIdByName function
            break;
          case "bidManager":
            formattedRow[modelField] = userMap[row[csvField]]; // Implement getSolutionIdByName function
            break;
          case "contact":
            formattedRow[modelField] = contactMap[row[csvField]]; // Implement getSolutionIdByName function
            break;
          case "stage":
            formattedRow[modelField] = tenderStageMap[row[csvField]]; // Implement getSolutionIdByName function
            break;
          case "associatedOpportunity":
            formattedRow[modelField] = null; // Implement getSolutionIdByName function
            break;
          case "bond":
            formattedRow[modelField] = bulkData[csvField] == "Y" ? true : false; // Implement getSolutionIdByName function
            break;
          default:
            formattedRow[modelField] = row[csvField];
        }

        if (
          modelField !== undefined &&
          formattedRow[modelField] === undefined
        ) {
          if (!analysisResult[rowIdx]) {
            analysisResult[rowIdx] = [];
          }
          analysisResult[rowIdx] = [
            ...analysisResult[rowIdx],
            { [colIdx]: { field: csvField, value: row[csvField] } },
          ];
        }
      }
    });
    return formattedRow;
  });

  return { formattedData, analysisResult };
};

export const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

export const getCorrectionFile = async (
  bulkData,
  resource,
  analysisResult,
  formattedData
) => {
  let csvToModelMap = null;
  switch (resource) {
    case "client":
      csvToModelMap = clientFieldMapping;
      break;
    case "contact":
      csvToModelMap = contactFieldMap;
      break;
    case "opportunity":
      csvToModelMap = opportunityFieldMap;
      break;
    case "tender":
      csvToModelMap = tenderFieldMap;
      break;
    case "businessDevelopment":
      csvToModelMap = bdFieldMap;
      break;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Write headers
  const headers = Object.keys(csvToModelMap).map((field) => field);
  worksheet.addRow(headers);
  formattedData.forEach((row, rowIdx) => {
    worksheet.addRow(
      headers.map(
        (header) => row[csvToModelMap[header]] || bulkData[rowIdx][header]
      )
    );
  });

  // Apply highlights based on the analysisResult
  Object.keys(analysisResult).forEach((rowIdx) => {
    const cells = analysisResult[rowIdx];
    cells.forEach((cell) => {
      Object.keys(cell).forEach((colIdx) => {
        const cellAddress = worksheet.getCell(
          parseInt(rowIdx) + 2,
          parseInt(colIdx) + 1
        );
        cellAddress.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFC0C0" }, // Light red background
        };
      });
    });
  });

  // Write the workbook to a file
  const uniqueName = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");
  const buffer = await workbook.xlsx.writeBuffer();
  const file = {
    buffer: buffer,
    originalname: `${resource}-${uniqueName}.xlsx`,
  };
  const correctionFileUrl = await uploadAndGetAvatarUrl(
    file,
    `CRM/${resource}/correctionFiles`,
    file.originalname,
    "stream"
  );

  return correctionFileUrl;
};

export const sendBulkUploadResponse = async (
  res,
  check,
  bulkData,
  formattedData,
  analysisResult,
  resourceType
) => {
  let EntityModel = null;
  switch (resourceType) {
    case "client":
      EntityModel = ClientMasterModel;
      break;
    case "contact":
      EntityModel = ContactMasterModel;
      break;
    case "tender":
      EntityModel = TenderMasterModel;
      break;
    case "opportunity":
      EntityModel = OpportunityMasterModel;
      break;
    case "businessDevelopment":
      EntityModel = BusinessDevelopmentModel;
      break;
  }
  if (!check && Object.keys(analysisResult).length === 0) {
    const entities = await EntityModel.insertMany(formattedData);
    const uniqueName = new Date().toLocaleString();
    const ids = entities.map((client) => client._id.toString());
    const csv = parse(ids.map((id) => ({ id })));
    const csvStream = new Readable();
    csvStream.push(csv);
    csvStream.push(null);
    const buffer = await streamToBuffer(csvStream);
    const file = {
      buffer: buffer,
      originalname: `${resourceType}-${uniqueName}.csv`,
    };
    // Ensure the directory exists (create if it doesn't)
    const fileUrl = await uploadAndGetAvatarUrl(
      file,
      `CRM/BulkUploads/Backup/${resourceType}`,
      uniqueName,
      "stream"
    );
    res.send({
      status: "success",
      type: "backup",
      message: `${resourceType} bulk import successful`,
      data: { url: fileUrl },
    });
  } else {
    console.log("jumped in else");
    const correctionFileUrl = await getCorrectionFile(
      bulkData,
      `${resourceType}`,
      analysisResult,
      formattedData
    );
    res.json({
      status: "success",
      type: "correction",
      message: `There are corrections in this ${resourceType} file!`,
      data: { url: correctionFileUrl },
    });
  }
};

export const parseRevenueData = (bulkData) => {
  let yearQuarterPositions = [];
  const firstRow = bulkData[0]; // First row contains the headers

  // Identify the positions of years and quarters in the first row
  Object.entries(firstRow).forEach(([key, value], index) => {
    let match = key.match(/REVENUE IN (\d{4})/);
    if (match) {
      let year = parseInt(match[1], 10);
      yearQuarterPositions.push({
        year: year,
        Q1: index, // Assume the next few fields are Q1, Q2, Q3, Q4
        Q2: index + 1,
        Q3: index + 2,
        Q4: index + 3,
      });
    }
  });

  // Parse the revenue data for each row
  return bulkData.slice(1).map((row) => {
    let revenueData = [];

    yearQuarterPositions.forEach(({ year, Q1, Q2, Q3, Q4 }) => {
      let revenueEntry = {
        year: year,
        Q1: parseFloat(row[Object.keys(firstRow)[Q1]]) || 0,
        Q2: parseFloat(row[Object.keys(firstRow)[Q2]]) || 0,
        Q3: parseFloat(row[Object.keys(firstRow)[Q3]]) || 0,
        Q4: parseFloat(row[Object.keys(firstRow)[Q4]]) || 0,
      };
      revenueData.push(revenueEntry);
    });

    return revenueData;
  });
};
