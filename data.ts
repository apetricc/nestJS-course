
//nestJS is mostly going to use Typescript files
// which let us assign types to our variables.


let myName = "drew"
// and we can reassign to other strings
myName = "bob"
// but if we try
//myName = 55 // we get an error from typescript b/c it infers the type of "myName"

//moving enum definition to the top to avoid error calling it before it is declared!
// adding an export so we can use it elsewhere too
export enum ReportType {
    INCOME = "income",
    EXPENSE = "expense"
}

// we make an object that has an array of reports
// TS will assign type 'any' by default
export const data: Data = {
    //adding some dummy data for testing
    report: [
        {
            id: "uuid1",
            source: "Salary",
            amount: 7500,
            created_at: new Date(),
            updated_at: new Date(),
            type: ReportType.INCOME
        },
        {
            id: "uuid2",
            source: "YouTube",
            amount: 3200,
            created_at: new Date(),
            updated_at: new Date(),
            type: ReportType.INCOME
        },
        {
            id: "uuid3",
            source: "Food",
            amount: 400,
            created_at: new Date(),
            updated_at: new Date(),
            type: ReportType.EXPENSE
        }
    ]
}

//so we make the interface, and then we say our 'const data' is of type 'Data'
interface Data {
    report: {
        id: string;
        source: string;
        amount: number;
        created_at: Date;
        updated_at: Date;
        type: ReportType
        // for 'type' we initially said type string, but even better we can say Only the strings
        // "income" OR "expense"
        // and even better than that, we can define an enum
        // type: string; --> type: "income" | "expense" --> type: ReportTypeEnum
        //
    }[]
}


// with type any we can push anything to the reports array without error
// data.report.push("adsadfasdf")
// data.report.push(545463465345)
// data.report.push(true)

// this is the kind of data object we want to be able to push to our 'report',
// so we can simply put this in the definition of the 'data' const,
// but we don't want to put actual values in there initially, so we should an interface for 'Data'
data.report.push({
    id: "uuid",
    source: "Salary",
    amount: 7500,
    created_at: new Date(),
    updated_at: new Date(),
    type: ReportType.INCOME
})



