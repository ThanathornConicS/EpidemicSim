class FuzzyModule
{
    constructor()
    {
        this.fuzzyVariables = new Map();
        this.fuzzyRules = [];
    }

    CreateFLV(varName)
    {
        let flv = new FuzzyVariable();
        this.fuzzyVariables.set(varName, flv);
        return flv;
    }
    AddRule(rule)
    {
        this.fuzzyRules.push(rule);
    }
    ApplyRules()
    {
        //console.log(this.fuzzyRules);
        for(let i = 0; i < this.fuzzyRules.length; i++)
        {
			// to calculate consequence's confidence of each rule
			this.fuzzyRules[i].CalculateConsequenceWithAND();
        }
    }

    Fuzzification(flvName, val)
    {
        //console.log(this.fuzzyVariables.get(flvName));
        this.fuzzyVariables.get(flvName).Fuzzify(val);
    }
    Defuzzification(flvName)
    {
        let desirableValue = 0.0;
        desirableValue = this.fuzzyVariables.get(flvName).DefuzzifyAvgMax();
        
        return desirableValue;
    }
}