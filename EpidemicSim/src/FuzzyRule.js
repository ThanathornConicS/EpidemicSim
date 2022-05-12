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
        for(let condition in this.conditions)
        {
            if(confidence > condition.degreeOfMembership)
                confidence = condition.degreeOfMembership;
        }
        
        this.consequence.SetConfidenceWithOR(confidence);
    }
}