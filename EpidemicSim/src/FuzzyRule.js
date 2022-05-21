class FuzzyRule
{
    constructor(condition1, condition2, consequence)
    {
        this.conditions = [];
        this.conditions.push(condition1);
        this.conditions.push(condition2);

        this.consequence = consequence;
    }

    CalculateConsequenceWithAND()
    {
        let confidence = Number.MAX_VALUE;
        for(let i = 0; i < this.conditions.length; i++)
        {
            if(confidence > this.conditions[i].degreeOfMembership)
            {
                confidence = this.conditions[i].degreeOfMembership;
            }
        }
        //console.log("Confidence: " + confidence);
        this.consequence.SetConfidenceWithOR(confidence);
    }
}