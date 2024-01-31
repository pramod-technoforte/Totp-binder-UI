import React from "react";

const ImageDisplay = ({ 
    imageUrl 
}) => {
    return (
        <div className="flex justify-center mt-20 mb:mt-0 lg:w-1/2 md:w-1/2 w-5/6 mb-10 md:mb-0">
            <div>
                <img
                className="object-contain rtl:scale-x-[-1]"
                src={imageUrl}
                />
            </div>
		</div>
    );
};

export default ImageDisplay;
