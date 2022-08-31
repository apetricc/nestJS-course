// the default code, we won't use so we can understand from the ground up:
// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }
// every single entity in nest js is a class!

// we need to tell NestJS that this class will be a controller
// and should have the ability to create endpoints
// to do this, we will use a 'decorator'
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode } from "@nestjs/common"
import { v4 as uuid } from "uuid";
import { type } from "os";
import { data, ReportType } from "src/data"
let myFunction = (a, b) => a / b;
var hello = (val) => "Hello " + val;
//trying to make a function for this bit of code DRY
//const getReportType = (input: string) =>  input === "income" ? ReportType.INCOME : ReportType.EXPENSE;

// old school function version:
function getReportType1(input: string): string {
  return input === "income" ? ReportType.INCOME : ReportType.EXPENSE;
}
// method/function getReportType()   takes an input called 'input' which is a string type,
// and the method itself returns a string type
let logReportType = (input: string): void => {
  // return input === "income" ? ReportType.INCOME : ReportType.EXPENSE;
  let output = input === "income" ? ReportType.INCOME : ReportType.EXPENSE;
  return console.log(`The report type is given as: ${input}, and the value assigned was: ${output}`)
  //  is the same as:
  // if(input === "income") return ReportType.INCOME;
  // else return ReportType.EXPENSE;
}
// method/function getReportType()   takes an input called 'input' which is a string type,
// and the method itself returns a string type
let getReportType = (input: string): string => {
  return input === "income" ? ReportType.INCOME : ReportType.EXPENSE;
  //  is the same as:
  // if(input === "income") return ReportType.INCOME;
  // else return ReportType.EXPENSE;
}


// and we use the decorator like we use spring annotations
@Controller('report/:type')
export class AppController {
  // we use the Get() decorator above the method that will be a GET request
  @Get('')
  getAllReports(@Param('type') type: string) {
    // we need to know if it's an INCOME or an EXPENSE report, but how do we get the dynamic field ":type" inside our method??
    // we do that with "param decorators"  -- so we have to import it like our other deocorators 1st
    // then we have to pass the param inside the parens "()", AND declare the type like this: @Param('paramName') type: string
    //console.log(type); // this will print out whatever gets passed on the request, we will learn to only accept "income" OR "expense" now:
    // const reportType = type === "income" ? ReportType.INCOME : ReportType.EXPENSE
    // getReportType(type)
    //Laith code:
    // const reportType = type === "income" ? ReportType.INCOME : ReportType.EXPENSE
    // return data.report.filter((report) => report.type === reportType);
    //my code:
    return data.report.filter((report) => report.type === getReportType(type));
  }
  // next one a little tougher, we just have to extract the report type, AND the id, same way though
  @Get(':id')
  getReportById(@Param('type') type: string, @Param('id') id: string) {
    console.log({
      'reportType': type,
      'id': id
    })
    const reportType = type === "income" ? ReportType.INCOME : ReportType.EXPENSE
    //find the report with a specific id
    return data.report.filter((report) => report.type === reportType).find(report => report.id === id);
  }
  //@1:13 of video
  // to do the Post method, we need use the body of the request, and to access this we need to use the
  // @Body decorator (and import it to our controller TS file)
  @Post()      // we could say to import the @Body as "body" and give the types, or destructure it as its elements as "{amount, source}"
  createReport(@Body() { amount, source }: { amount: number; source: string; }, @Param('type') type: string) {
    // console.log({ body });
    const newReport = {
      id: uuid(),
      // source: body.source
      // or simplify to--> source: source
      // or even simpler to:
      source,
      amount,
      created_at: new Date(),
      updated_at: new Date(),
      //type we have to extract from the params using @Param decorator (at 1:18:35)
      type: type === "income" ? ReportType.INCOME : ReportType.EXPENSE
    }
    data.report.push(newReport)
    return newReport;
  }


  // @Put(":id")
  myUpdateReport(@Body() { amount, source }: { amount: number, source: string; }, @Param('id') id: string, @Param('type') type: string) {
    /** I get that there are these fields:
        id: string;
        source: string;
        amount: number;
        created_at: Date;
        updated_at: Date;
        type: ReportType
        */
    // and we need to update one or all of them...
    // how do we assign a new value? just like post but reuse uuid??
    const newReport = {
      id: id,
      source,
      amount,
      created_at: new Date(),
      updated_at: new Date(),
      //type we have to extract from the params using @Param decorator (at 1:18:35)
      type: type === "income" ? ReportType.INCOME : ReportType.EXPENSE
    }
    const reportType = type === "income" ? ReportType.INCOME : ReportType.EXPENSE
    //try to find the report with matching id, but then what?  Pop it and replace with a new one with same uuid??
    console.log(`This is what I get when I try to filter id and THEN type, I get a report *I think*: ` + JSON.stringify(data.report.filter((report) => report.type === type).find(report => report.id === id)));
    // so (data.report.filter((report) => report.type === type).find(report => report.id === id)) gives me the report I want
    // now I just have to update the source, amount, and updated_at fields I think...
    let updateReport = (data.report.filter((report) => report.type === type).find(report => report.id === id));
    updateReport.amount = amount === NaN ? amount : updateReport.amount;
    updateReport.source = source === "" ? source : updateReport.source;
    updateReport.updated_at = new Date();

    // data.report.push(newReport)
    return `updating report ${id};  amount to ${amount}, and source to ${source}.  Hopefully updated object from database: ` + JSON.stringify(data.report.filter((report) => report.type === type).find(report => report.id === id));
    // unfortunatly this did not actually update the fields in the data.report object for some reason.  Not sure how to push it without
    // creating a duplicate id field...
  }// my 1st try at PUT request

  //Laith's version of PUT request:

  @Put(":id")
  updateReport(
    // @Body() {amount, source}: {amount: number, source: string;},
    @Body() body: { amount: number; source: string },
    @Param('id') id: string,
    @Param('type') type: string) {
    // 1st thing, we want to find if the report exists; if so contintue with logic, else don't continue
    const reportType = type === "income" ? ReportType.INCOME : ReportType.EXPENSE
    //find the report with a specific id in words: "looking at the data.report array of objects, FILTER the 'reports' WHERE
    // report.type is equal to 'reportType' (income/expense) THEN on that filtered list/array of objects, FIND the report object
    // WHERE report.id (the id element of the report object) is EQUAL to 'id' which is getting passed in by user... and assign to the const "report"
    const reportToUpdate = data.report.filter((report) => report.type === reportType).find(report => report.id === id);
    //if that report doesn't exist, return early and quit for now (we'll add error handling later)
    if (!reportToUpdate) return;

    // else we need to find where a specific thing lives inside the array, best way to do that is with the index!
    const reportIndex = data.report.findIndex((report) => report.id === reportToUpdate.id);

    // once we have the index, all we have to do is perform the update
    // so goto the index in the report array, destructure that object with the "..."
    // and we're also going to destructure out the 'body' that we get passed from user
    // other than understanding the idea of destructuring, not sure what's happening here!
    // it's saying update anything in data.report[index] with any new stuff given after the comma.
    // so we could say like this too:
    // data.report[reportIndex] = {
    //   ...data.report[reportIndex],
    //   amount: body.amount,
    //   source: body.source
    // }
    data.report[reportIndex] = {
      ...data.report[reportIndex],
      ...body
    }

    // then we're going to return that new updated object
    // return `Updated index ${reportIndex} ` + JSON.stringify(data.report[reportIndex]);
    return data.report[reportIndex];
  }




//my version of delete that works with /myDelete/ added to path! X^D
  @Delete('/myDelete/' + ':id')
  myDeleteReport(@Param('id') id: string, @Param('type') type: string) {
    const reportType = type === "income" ? ReportType.INCOME : ReportType.EXPENSE
    const reportToUpdate = data.report.filter((report) => report.type === reportType).find(report => report.id === id);
    //if that report doesn't exist, return early and quit for now (we'll add error handling later)
    if (!reportToUpdate) return;

    // else we need to find where a specific thing lives inside the array, best way to do that is with the index!
    const reportIndex = data.report.findIndex((report) => report.id === reportToUpdate.id);
    data.report.splice(reportIndex)
    return `deleted ${type} report: ${id}`;
  }

  //Laith's version of delete:
  @HttpCode(204)
  @Delete(':id')
  deleteReport(@Param('id') id: string, @Param('type') type: string)
  {
    const reportIndex = data.report.findIndex(report => report.id === id);

    if(reportIndex === -1) return;
    // so if the reportIndex is NOT -1, then there is a matching report,
    // and we could filter it out, or we can use the splice() method
    // we can pass the params of the index where to start, and how many indexes to splice
    data.report.splice(reportIndex, 1);

    // I think the @HttpCode(204) may supercede this return message, it doesn't print, but the endpoint works!
    return `deleted ${type} report with id: ${id}`;
    //but we also want to return a new status code to 204--'no content' with decorator @HttpCode(204)
  }

// now we have the logic for all our endpoints, but with a bunch of gaping flaws.  We will address those next
// @ 1:33 of video! 8-28-2022


  // test for fun:
  @Get('hello')
  getHello() {
    return "Hello!";
  }






}
// then we need to export this class (by saying "export" in front of the class declaration) b/c it will be used in the app.module.ts file
// so we have to export it so it can access it obviously;
// then we refresh our localhost:3000 and see that we should get back that empty array "[]" in our browser;
// @29:09 of video;

/**
 *   so at this point the request we are making in our browser is a GET request to  http://localhost:3000/
 *    our app sees the GET request and runs our function, returning whatever we tell it to
 *   we want it to return the stuff when we go to http://localhost:3000/report/income
 *   the controller simply goes to "/" by default, so we just need to append the additional path in the decorator;
 *   we can put in the "@Controller()" decorator, or the "@Get()" decorator.  We'll put in the @Get so it is more specific(?)
 *   it will look like this: @Get('report/income')
 *  why to put it in the @Get instead of the @Controller?
 * Whatever we put in the @Controller gets added to the base path.  So if we have @Controller('hi') & @Get('hello')
 *  we would have to say localhost:3000/hi/hello to get to our GET request function
 *   so if we want a path to be appended to everything in our controller, we put it in the @Controller() decorator,
 *   if we want an endpoint for a certain method, we'd put it in the @Get() decorator for a specific method/function;
 *
 *--------------------------------
  adding a dynamic ID to our path/decorator-->
  we need to add an ID to one of our @Get() decorators so we have a path like this:
  localhost:3000/report/income/asdfhhjj
  we could say @Get('asdfhhjj')  and that would work, but we want it to be dynamic.
  So what we do is we just put a colon in front and give that variable a name that makes sense, like ':id'
  Then we can put anything in there and it will call this method

  We can do the same thing in our 'base path' in the @Controller('report/:type')
  SO then we should be able to make requests to both localhost:3000/report/income AND localhost:3000/report/expense...
   or localhost:3000/report/ANYTHING?! But we will add error handling to fix that later, thankfully!
 ----------------------

 Now we want to also add the paths for POST, PUT, & DELETE.  They will need their own decorators, 3 guesses what those are.

 Then we created a collection in Postman to test our app b/c we can only do GET requests from our browser & we need a tool
 like postman to do the other operations. We created that collection, and have covered the basics of what our
 controller classes will be doing (with this app and others). Our functions aren't really doing anything yet though...
 SO--Next we will add the actual functionality to our app!!
 @ 50:11 of video
 To do this we need some kind of DB to store our values/reports



  */








