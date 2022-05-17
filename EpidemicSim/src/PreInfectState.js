class PreInfectState
{
    constructor()
    {
        if(this.constructor == PreInfectState)
            throw new Error("Abstract classes can't be instantiated.");

        this.FLV_NAME = Object.freeze
        ({
            FZ_SET_PROTECTION: 0,
            FZ_SET_EXPOSURE: 1,
            FZ_SET_POSSIBILITY: 2,
        });
        this.FZ_SET_PROTECTION = Object.freeze
        ({
            LOW: 0,
            NORMAL: 1,
            HIGH: 2,
        });
        this.FZ_SET_EXPOSURETIME = Object.freeze
        ({
            SHORT: 0,
            MEDUIM: 1,
            LONG: 2,
        });
        this.FZ_SET_POSSIBILITY = Object.freeze
        ({
            IMPOSSIBLE: 0,
            LIKELY: 1,
            GUARANTEE: 2,
        });
        this.fuzzyModule = new FuzzyModule();
    }

    InitFuzzy()
    {
        throw new Error("Abstract Method has no implementation");
    }
    GetDesirability (protectionFactor, exposureFactor)
    {
		this.fuzzyModule.Fuzzification (this.FLV_NAME.FZ_SET_PROTECTION.toString ("F"), protectionFactor);
		this.fuzzyModule.Fuzzification (this.FLV_NAME.FZ_SET_EXPOSURE.toString ("F"), exposureFactor);

		this.fuzzyModule.ApplyRules();

		return this.fuzzyModule.Defuzzification (	this.FLV_NAME.FZ_SET_POSSIBILITY.toString ("F"));
	}
}


class PreInfect_Susceptible extends PreInfectState
{
    constructor()
    {
        super();
    }

    InitFuzzy()
    {
        this.FLV_Protection = this.fuzzyModule.CreateFLV(this.FLV_NAME.FZ_SET_PROTECTION.toString("F"));
        this.FLV_Exposure = this.fuzzyModule.CreateFLV(this.FLV_NAME.FZ_SET_EXPOSURE.toString("F"));
        this.FLV_Possibility = this.fuzzyModule.CreateFLV(this.FLV_NAME.FZ_SET_POSSIBILITY.toString("F")); 
        
        this.Protection_Low = FLV_Protection.AddLeftSet
        (
            this.FZ_SET_PROTECTION.LOW.toString("F"), 0, 10, 50
        );
        this.Protection_Normal = FLV_Protection.AddTriangularSet
        (
            this.FZ_SET_PROTECTION.NORMAL.toString("F"), 10, 50, 90
        );
        this.Protection_High = FLV_Protection.AddRightSet
        (
            this.FZ_SET_PROTECTION.HIGH.toString("F"), 50, 90, 100
        );

        this.Exposure_Short = FLV_Exposure.AddLeftSet
        (
            this.FZ_SET_EXPOSURETIME.SHORT.toString("F"), 0, 2, 5
        );
        this.Exposure_Medium = FLV_Exposure.AddTriangularSet
        (
            this.FZ_SET_EXPOSURETIME.MEDUIM.toString("F"), 2, 5, 8
        );
        this.Exposure_Long = FLV_Exposure.AddRightSet
        (
            this.FZ_SET_EXPOSURETIME.LONG.toString("F"), 5, 8, 10
        );

        this.Possibility_Impossible = FLV_Possibility.AddLeftSet
        (
            this.FZ_SET_POSSIBILITY.IMPOSSIBLE.toString("F"), 0, 25, 50
        );
        this.Possibility_Likely = FLV_Possibility.AddTriangularSet
        (
            this.FZ_SET_POSSIBILITY.LIKELY.toString("F"), 25, 50, 75
        );
        this.Possibility_Guarantee = FLV_Possibility.AddRightSet
        (
            this.FZ_SET_POSSIBILITY.GUARANTEE.toString("F"), 50, 75, 100
        );

        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Low, this.Exposure_Short, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Low, this.Exposure_Medium, this.Possibility_Impossible));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Low, this.Exposure_Long, this.Possibility_Impossible));

        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Normal, this.Exposure_Short, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Normal, this.Exposure_Medium, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Normal, this.Exposure_Long, this.Possibility_Impossible));

        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_High, this.Exposure_Short, this.Possibility_Guarantee));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_High, this.Exposure_Medium, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_High, this.Exposure_Long, this.Possibility_Likely));
    }
}


class PreInfect_MildInfect extends PreInfectState
{
    constructor()
    {
        super();
    }

    InitFuzzy()
    {
        this.FLV_Protection = this.fuzzyModule.CreateFLV(this.FLV_NAME.FZ_SET_PROTECTION.toString("F"));
        this.FLV_Exposure = this.fuzzyModule.CreateFLV(this.FLV_NAME.FZ_SET_EXPOSURE.toString("F"));
        this.FLV_Possibility = this.fuzzyModule.CreateFLV(this.FLV_NAME.FZ_SET_POSSIBILITY.toString("F")); 
        
        this.Protection_Low = FLV_Protection.AddLeftSet
        (
            this.FZ_SET_PROTECTION.LOW.toString("F"), 0, 10, 50
        );
        this.Protection_Normal = FLV_Protection.AddTriangularSet
        (
            this.FZ_SET_PROTECTION.NORMAL.toString("F"), 10, 50, 90
        );
        this.Protection_High = FLV_Protection.AddRightSet
        (
            this.FZ_SET_PROTECTION.HIGH.toString("F"), 50, 90, 100
        );

        this.Exposure_Short = FLV_Exposure.AddLeftSet
        (
            this.FZ_SET_EXPOSURETIME.SHORT.toString("F"), 0, 2, 5
        );
        this.Exposure_Medium = FLV_Exposure.AddTriangularSet
        (
            this.FZ_SET_EXPOSURETIME.MEDUIM.toString("F"), 2, 5, 8
        );
        this.Exposure_Long = FLV_Exposure.AddRightSet
        (
            this.FZ_SET_EXPOSURETIME.LONG.toString("F"), 5, 8, 10
        );

        this.Possibility_Impossible = FLV_Possibility.AddLeftSet
        (
            this.FZ_SET_POSSIBILITY.IMPOSSIBLE.toString("F"), 0, 25, 50
        );
        this.Possibility_Likely = FLV_Possibility.AddTriangularSet
        (
            this.FZ_SET_POSSIBILITY.LIKELY.toString("F"), 25, 50, 75
        );
        this.Possibility_Guarantee = FLV_Possibility.AddRightSet
        (
            this.FZ_SET_POSSIBILITY.GUARANTEE.toString("F"), 50, 75, 100
        );

        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Low, this.Exposure_Short, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Low, this.Exposure_Medium, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Low, this.Exposure_Long, this.Possibility_Impossible));

        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Normal, this.Exposure_Short, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Normal, this.Exposure_Medium, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Normal, this.Exposure_Long, this.Possibility_Likely));

        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_High, this.Exposure_Short, this.Possibility_Impossible));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_High, this.Exposure_Medium, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_High, this.Exposure_Long, this.Possibility_Likely));
    }
}


class PreInfect_SevereInfect extends PreInfectState
{
    constructor()
    {
        super();
    }

    InitFuzzy()
    {
        this.FLV_Protection = this.fuzzyModule.CreateFLV(this.FLV_NAME.FZ_SET_PROTECTION.toString("F"));
        this.FLV_Exposure = this.fuzzyModule.CreateFLV(this.FLV_NAME.FZ_SET_EXPOSURE.toString("F"));
        this.FLV_Possibility = this.fuzzyModule.CreateFLV(this.FLV_NAME.FZ_SET_POSSIBILITY.toString("F")); 
        
        this.Protection_Low = this.FLV_Protection.AddLeftSet
        (
            this.FZ_SET_PROTECTION.LOW.toString("F"), 0, 10, 50
        );
        this.Protection_Normal = this.FLV_Protection.AddTriangularSet
        (
            this.FZ_SET_PROTECTION.NORMAL.toString("F"), 10, 50, 90
        );
        this.Protection_High = this.FLV_Protection.AddRightSet
        (
            this.FZ_SET_PROTECTION.HIGH.toString("F"), 50, 90, 100
        );

        this.Exposure_Short = this.FLV_Exposure.AddLeftSet
        (
            this.FZ_SET_EXPOSURETIME.SHORT.toString("F"), 0, 2, 5
        );
        this.Exposure_Medium = this.FLV_Exposure.AddTriangularSet
        (
            this.FZ_SET_EXPOSURETIME.MEDUIM.toString("F"), 2, 5, 8
        );
        this.Exposure_Long = this.FLV_Exposure.AddRightSet
        (
            this.FZ_SET_EXPOSURETIME.LONG.toString("F"), 5, 8, 10
        );

        this.Possibility_Impossible = this.FLV_Possibility.AddLeftSet
        (
            this.FZ_SET_POSSIBILITY.IMPOSSIBLE.toString("F"), 0, 25, 50
        );
        this.Possibility_Likely = this.FLV_Possibility.AddTriangularSet
        (
            this.FZ_SET_POSSIBILITY.LIKELY.toString("F"), 25, 50, 75
        );
        this.Possibility_Guarantee = this.FLV_Possibility.AddRightSet
        (
            this.FZ_SET_POSSIBILITY.GUARANTEE.toString("F"), 50, 75, 100
        );

        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Low, this.Exposure_Short, this.Possibility_Impossible));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Low, this.Exposure_Medium, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Low, this.Exposure_Long, this.Possibility_Guarantee));

        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Normal, this.Exposure_Short, this.Possibility_Impossible));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Normal, this.Exposure_Medium, this.Possibility_Likely));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_Normal, this.Exposure_Long, this.Possibility_Likely));

        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_High, this.Exposure_Short, this.Possibility_Impossible));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_High, this.Exposure_Medium, this.Possibility_Impossible));
        this.fuzzyModule.AddRule(new FuzzyRule(this.Protection_High, this.Exposure_Long, this.Possibility_Likely));
    }
}