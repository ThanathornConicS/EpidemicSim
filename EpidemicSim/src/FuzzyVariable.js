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
        //console.log("Set Name: " + name + " - " + minBound + ", " + peak + ", " + maxBound);
        let leftSet = new FuzzySet_Left(peak, peak - minBound, maxBound - peak);
        this.MemberSets.set(name, leftSet);

        return leftSet;
    }
    AddRightSet(name, minBound, peak, maxBound)
    {
        let rightSet = new FuzzySet_Right(peak, peak - minBound, maxBound - peak);
        this.MemberSets.set(name, rightSet);
        
        return rightSet;
    }
    AddTriangularSet(name, minBound, peak, maxBound)
    {
        let triSet = new FuzzySet_Triangle(peak, peak - minBound, maxBound - peak);
        this.MemberSets.set(name, triSet);
        
        return triSet;
    }

    Fuzzify(val)
    {
        for(let [key, value] of this.MemberSets)
        {
            value.degreeOfMembership = value.CalculateDOM(val);
            //console.log("DOM: " + (value.degreeOfMembership));
        }
    }
    DefuzzifyAvgMax()
    {
        let sum_repTimeConfidence = 0.0;
		let sum_confidence = 0.0;

		for(let [key, value] of this.MemberSets)
        {
            sum_repTimeConfidence += (value.degreeOfMembership * value.RepresentativeValue);
			sum_confidence += value.degreeOfMembership;
            console.log("DOM: " + value.degreeOfMembership);
            console.log("REP: " + value.RepresentativeValue);
		}
        
		return sum_repTimeConfidence / sum_confidence;
    }
}