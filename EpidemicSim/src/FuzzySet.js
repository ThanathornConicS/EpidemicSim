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
        if ( this.rightOffset == 0.0 && val == this.peakPoint) 
			return 1.0;

		// If the value is on the left side
		if ( val <= this.peakPoint && val >= this.leftOffset) 
        {
			return 1.0;
		}
		// If the value is on the right side
		else if ( val > this.peakPoint && val < (this.peakPoint + this.rightOffset) ) 
        {
			return (val - this.peakPoint) / -this.rightOffset + 1.0;
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
        if ( this.leftOffset == 0.0 && val == this.peakPoint)
			return 1.0;

		//If the value is on the left side
		if (val < this.peakPoint && val >= (this.peakPoint - this.leftOffset)) 
        {
			return (val - (this.peakPoint - this.leftOffset)) / this.leftOffset;
		}
		//If the value is on the right side
		else if (val >= this.peakPoint && val <= this.rightOffset) 
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
        if ((this.rightOffset == 0.0 && this.peakPoint == val) || 
			(this.leftOffset == 0.0 && this.peakPoint == val) )
			return 1.0;

		//If the value is on the left side
		if (val <= this.peakPoint && val >= (this.peakPoint - this.leftOffset)) 
        {
			return (val - (this.peakPoint - this.leftOffset)) / this.leftOffset;
		}
		//If the value is on the right side
		else if ( val > this.peakPoint && val < (this.peakPoint + this.rightOffset) ) 
        {
			return (val - this.peakPoint) / -this.rightOffset + 1.0;
		} 
		else 
        {
			return 0.0;
		}
    }
}