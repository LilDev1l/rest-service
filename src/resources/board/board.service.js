const { StatusCodes } = require('http-status-codes');
const infoMessagesWithContext = require('../../utils/errorProcessing').infoMessagesWithContext('board');
const BoardRepo = require('./board.memory.repository');
const ColumnRepo = require('../column/column.memory.repository');
const TaskRepo = require('../task/task.memory.repository');
const { NotFoundError } = require('../../errors/index');

function checkExistElement(element, id) {
  if (!element) {
    throw new NotFoundError(StatusCodes.NOT_FOUND, infoMessagesWithContext.notFoundMessage(id));
  }
}

const getAll = () => BoardRepo.getAll();

const getOne = (id) => {
  const board = BoardRepo.getOne(id);
  checkExistElement(board, id);

  return board;
};

const addOne = newParam => {
  const columns = newParam.columns.map(c => ColumnRepo.insert(c));
  const newParamWithColumns = { ...newParam, columns };

  return BoardRepo.insert(newParamWithColumns);
};

const remove = id => {
  const board = BoardRepo.getOne(id);
  checkExistElement(board, id);

  TaskRepo.deleteAllTasksOnBoard(id);
  board.columns.forEach(c => ColumnRepo.delete(c.id));

  BoardRepo.delete(id);
};

const update = (id, updateParam) => {
  const board = BoardRepo.getOne(id);
  checkExistElement(board, id);

  board.columns.forEach(c => ColumnRepo.delete(c.id));
  updateParam.columns.forEach(c => ColumnRepo.update(c.id, c));

  return BoardRepo.update(id, updateParam);
};

module.exports = {
  getAll, getOne,
  addOne,
  remove,
  update
};
