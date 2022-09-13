//we need another decorator called "Injectable"
import { Injectable, Param, Body } from "@nestjs/common";

import { ReportType, data } from "src/data"
import { v4 as uuid } from "uuid";
let getReportType = (input: string): string => {
  return input === "income" ? ReportType.INCOME : ReportType.EXPENSE;//aka:
  // if(input === "income") return ReportType.INCOME;
  // else return ReportType.EXPENSE;
}

interface Report {source: string, amount: number};

// This is where all the logic will live;
// all entities in NestJS are classes so it will be class;

@Injectable()
export class AppService {


  getAllReports(type: ReportType) {
    return data.report.filter((report) => report.type === type);
  }//getAllReports

  getReportById(type: ReportType, id: string){
    return data.report.filter((report) => report.type === type).find(report => report.id === id);
  }

  createReport(type: ReportType, {amount, source}: Report) {
    const newReport = {
      id: uuid(),
      source,
      amount,
      created_at: new Date(),
      updated_at: new Date(),
      //Now we get type passed to us from the call in controller
      type
    }
    data.report.push(newReport)
    return newReport;
  }

  updateReport(type: ReportType, id: string, body: Report) {
    // const reportType = type === "income" ? ReportType.INCOME : ReportType.EXPENSE
    const reportToUpdate = data.report.filter((report) => report.type === type).find(report => report.id === id);
    if (!reportToUpdate) return;
    const reportIndex = data.report.findIndex((report) => report.id === reportToUpdate.id);
    data.report[reportIndex] = {
      ...data.report[reportIndex],
      ...body,
      updated_at: new Date()
    }
    return data.report[reportIndex];

  }

  deleteReport(id: string) {
    const reportIndex = data.report.findIndex(report => report.id === id);
    if(reportIndex === -1) return;
    data.report.splice(reportIndex, 1);
    //not sure if this message is reachable?  with the @HttpCode(204)
    return `Deleted a report`;
  }


}// AppService class





// the default code was:
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AppService {
//   getHello(): string {
//     return 'Hello World!';
//   }
// }