class FuzzySet
{
    constructor(repVal)
    {
        if(this.constructor == FuzzySet)
            throw new Error("Abstract classes can't be instantiated.");
        
        this.degreeOfMembership = 0.0;
        this.RepresentativeValue = repVal;
    }

    CalculateDOM(val)
    {
        throw new Error("Abstract Method has no implementation");
    }
    ClearDOM()
    {
        this.degreeOfMembership = 0.0;
    }
    SetConfidenceWithOR(val)
    {
        if(this.degreeOfMembership < val)
            this.degreeOfMembership = val;
    }

    get RepresentativeValue()
    {
        return this.RepresentativeValue;
    }
    set RepresentativeValue(val)
    {
        this.RepresentativeValue = val;
    }

    get degreeOfMembership()
    {
        return this.degreeOfMembership;
    }
    set degreeOfMembership(val)
    {
        this.degreeOfMembership = val;
    }
}


class FuzzySet_Left extends FuzzySet
{
    constructor(peak, left, right)
    {
        super((peak + (peak - left)) / 2.0);

        this.peakPoint = peak;
        this.leftOffset = left;
        this.rightOffset = right;
    }

    CalculateDOM(val)
    {
        if ( rightOffset == 0.0 && val == peakPoint) 
			return 1.0;

		// If the value is on the left side
		if ( val <= peakPoint && val >= leftOffset) 
        {
			return 1.0;
		}
		// If the value is on the right side
		else if ( val > peakPoint && val < (peakPoint + rightOffset) ) 
        {
			return (val - peakPoint) / -rightOffset + 1.0;
		} 
        else 
        {
			return 0.0;
		}
    }
}


class FuzzySet_Right extends FuzzySet
{
    constructor(peak, left, right)
    {
        super((peak + (peak - right)) / 2.0);

        this.peakPoint = peak;
        this.leftOffset = left;
        this.rightOffset = right;
    }

    CalculateDOM(val)
    {
        if ( leftOffset == 0.0 && val == peakPoint)
			return 1.0;

		//If the value is on the left side
		if (val < peakPoint && val >= (peakPoint - leftOffset)) 
        {
			return (val - (peakPoint - leftOffset)) / leftOffset;
		}
		//If the value is on the right side
		else if (val >= peakPoint && val <= rightOffset) 
        {
			return 1.0;
		} 
		else {
			return 0.0;
		}
    }
}

class FuzzySet_Triangle extends FuzzySet
{
    constructor(mid, left, right)
    {
        super(mid);

        this.peakPoint = mid;
        this.leftOffset = left;
        this.rightOffset = right;
    }

    CalculateDOM(val)
    {
        if ((rightOffset == 0.0 && peakPoint == val) || 
			(leftOffset == 0.0 && peakPoint == val) )
			return 1.0;

		//If the value is on the left side
		if (val <= peakPoint && val >= (peakPoint - leftOffset)) 
        {
			return (val - (peakPoint - leftOffset)) / leftOffset;
		}
		//If the value is on the right side
		else if ( val > peakPoint && val < (peakPoint + rightOffset) ) 
        {
			return (val - peakPoint) / -rightOffset + 1.0;
		} 
		else 
        {
			return 0.0;
		}
    }
}