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
    ApplyRule()
    {
        for(let rule in this.fuzzyRules)
			// to calculate consequence's confidence of each rule
			rule.CalculateConsequenceWithAND();
    }

    Fuzzification(flvName, val)
    {
        this.fuzzyVariables[flvName].Fuzzify(val);
    }
    Defuzzification(flvName)
    {
        let desirableValue = 0.0;
        desirableValue = this.fuzzyVariables[flvName].DefuzzifyAvgMax();
        return desirableValue;
    }
}