import mongoose from "mongoose";
import TargetModel from "../models/TargetModel.js";

export const setTarget = async (entityType, entityId, year, targets, session) => {
  const existingTarget = await TargetModel.findOne({
    entityType,
    entityId,
    year,
  });

  if (existingTarget) {
    existingTarget.targets = targets;
    await existingTarget.save();
  } else {
    const newTarget = new TargetModel({ entityType, entityId, year, targets });
    await newTarget.save({session});
    return newTarget
  }
  
};

export const getTargetsForYear = async (entityType, year) => {
  const allEntities = await mongoose.model(entityType).find();
  const targets = await TargetModel.find({ entityType, year });

  const targetMap = new Map(
    targets.map((t) => [t.entityId.toString(), t.targets])
  );

  return allEntities.map((entity) => ({
    entityId: entity._id,
    label: entity.label,
    year,
    targets: targetMap.get(entity._id.toString()) || {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
    },
  }));
};

export const validateTargetsFormate = (targets) => {
  const validQuarters = ["q1", "q2", "q3", "q4"];
  const targetKeys = Object.keys(targets);
  if (
    targetKeys.length !== 4 ||
    !validQuarters.every((quarter) => targetKeys.includes(quarter)) ||
    !Object.values(targets).every(
      (value) => typeof value === "number" && value >= 0
    )
  ) {
    return false;
  } else {
    return true;
  }
};
