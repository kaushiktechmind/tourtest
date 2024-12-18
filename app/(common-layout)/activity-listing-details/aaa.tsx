<div className="col-span-12 xl:col-span-4">
    <div className="pb-0 mb-6 relative">
        <div className="bg-white rounded-2xl p-5 lg:py-8 lg:px-6 shadow-md">
            {/* Price Section */}
            <p className="mb-3 text-lg font-medium">Price</p>
            <div className="flex items-start gap-2 mb-6">
                <div className="flex gap-3 items-center">
                    <i className="las la-tag text-2xl"></i>
                    <p className="mb-0">From</p>
                    <h3 className="h3 mb-0">₹{packageData.sale_price}</h3>
                </div>
                <i className="las la-info-circle text-2xl"></i>
            </div>

            {/* Booking Form Section */}
            <div className="mb-6">
                <p className="text-lg font-medium mb-4">Booking Form</p>

                {/* Form Items */}
                <div className="space-y-4">
                    {/* Row: Select Date */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 font-medium">Select Date</p>
                            <p className="text-sm text-gray-400">₹1000 per booking</p>
                        </div>
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
                            <i className="las la-calendar text-xl"></i>
                        </button>
                    </div>

                    {/* Row: Adult */}
                    <div>
                        <p className="text-gray-500 text-sm">Age: 18+</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 font-medium">Adult</p>
                                <p className="text-sm text-gray-400">1000 per person</p>
                            </div>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                                <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                            </div>
                        </div>
                    </div>

                    {/* Row: Child */}
                    <div>
                        <p className="text-gray-500 text-sm">Age: 6-17</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 font-medium">Child</p>
                                <p className="text-sm text-gray-400">300 per person</p>
                            </div>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                </select>
                                <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                            </div>
                        </div>
                    </div>

                    {/* Row: Infant */}
                    <div>
                        <p className="text-gray-500 text-sm">Age: 0-5</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 font-medium">Infant</p>
                                <p className="text-sm text-gray-400">200 per person</p>
                            </div>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                </select>
                                <i className="las la-angle-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Price Section */}
            <div className="hr-dashed my-4"></div>
            <div className="flex items-center justify-between">
                <p className="mb-0 text-gray-600">Total</p>
                <p className="mb-0 font-medium">₹1025</p>
            </div>

            {/* Book Now Button */}
            <Link
                href="#"
                className="link inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white hover:bg-primary-400 hover:text-white font-medium w-full justify-center mt-6"
            >
                <span className="inline-block">Book Now</span>
            </Link>
        </div>
    </div>
</div>