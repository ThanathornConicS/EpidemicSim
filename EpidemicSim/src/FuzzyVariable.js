class FuzzyVariable
{
    constructor()
    {
        this.minRange = 0.0;
        this.maxRange = 0.0;
        this.MemberSets = new Map();
    }

    AddLeftSet(name, minBound, peak, maxBound)
    {
        let leftSet = new FuzzySet_Left(peak, peak - minBound, maxBound - peak);
        this.MemberSets.set(String.toString(name), leftSet);

        return leftSet;
    }
    AddRightSet(name, minBound, peak, maxBound)
    {
        let rightSet = new FuzzySet_Right(peak, peak - minBound, maxBound - peak);
        this.MemberSets.set(String.toString(name), rightSet);
        
        return rightSet;
    }
    AddTriangularSet(name, minBound, peak, maxBound)
    {
        let triSet = new FuzzySet_Right(peak, peak - minBound, maxBound - peak);
        this.MemberSets.set(String.toString(name), triSet);
        
        return triSet;
    }

    Fuzzify(val)
    {
        for(let fuzzySet in MemberSets.Values)
			fuzzySet.degreeOfMembership = fuzzySet.CalculateDOM(val);
    }
    DefuzzifyAvgMax()
    {
        let sum_repTimeConfidence = 0.0;
		let sum_confidence = 0.0;

		for(let item in MemberSets.Values) 
        {
			sum_repTimeConfidence += item.degreeOfMembership * item.RepresentativeValue;
			sum_confidence += item.degreeOfMembership;
		}
		return sum_repTimeConfidence / sum_confidence;
    }
}