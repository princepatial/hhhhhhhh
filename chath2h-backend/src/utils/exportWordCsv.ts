import { StreamableFile } from '@nestjs/common';
import { createReadStream, unlinkSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { Workbook } from 'exceljs';
import { TokenTransactionType } from 'src/tokenTransaction/entities/token-transaction-type';
import { Collection } from 'mongoose';

type UserListType = {
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  isDisabled: boolean;
};

type TokenListType = {
  userName: string;
  userEmail: string;
  transactionId: any;
  type: TokenTransactionType;
  tokenAmount: number;
  createdAt: Date;
  currency: string;
  amount: number;
  paymentId: string;
};

export const exportWordCsvController = (
  res: Response,
  usersListFile: string,
  isExcel?: boolean,
) => {
  const file = createReadStream(join(process.cwd(), usersListFile));
  const contentType = isExcel
    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    : 'text/csv';
  res.set({
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename=users-list.${
      isExcel ? 'xlsx' : 'csv'
    }`,
  });

  file.on('end', () => unlinkSync(usersListFile));
  file.pipe(res);

  return new StreamableFile(file);
};

export const exportWordCsvService = async (
  data: Array<UserListType | TokenListType>,
  headers: string[],
  fileName: string,
  isExcel?: boolean,
) => {
  const wb = new Workbook();
  const ws = wb.addWorksheet('Sheet 1');

  const filename = `${fileName}.${isExcel ? 'xlsx' : 'csv'}`;

  ws.columns = headers.map((header) => {
    return {
      key: header,
      header: header,
      width: 20,
    };
  });

  data.forEach((item) => {
    const array: Array<UserListType | TokenListType> = [];
    for (const key of Object.keys(item)) {
      array.push(item[key as keyof (UserListType | TokenListType)]);
    }
    ws.addRow([...array]);
  });

  ws.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  const tmp = './uploads/' + filename;

  isExcel
    ? await wb.xlsx.writeFile(tmp)
    : await wb.csv.writeFile(tmp, {
        formatterOptions: {
          delimiter: '\t',
          quote: false,
        },
      });

  return tmp;
};
