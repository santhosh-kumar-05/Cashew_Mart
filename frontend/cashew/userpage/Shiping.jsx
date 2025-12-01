import React, { useState } from "react";
import UserNav from "../userauthpage/UserNav";
import Select from "react-select";
import { countries } from "countries-list";
import { useDispatch } from "react-redux";
import { saveShipingInfo } from "../store/ShipingSlice";
import CheckoutSteps from "./CheckoutSteps";
import { useNavigate, useParams } from "react-router-dom";
import '../public/Shiping.css'
 

const Shipping = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
    postalCode: "",
    country: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const countryOptions = Object.entries(countries).map(([code, details]) => ({
    label: details.name,
    value: code,
  }));

  // ---- REAL VALIDATION ----
  const validate = () => {
    let temp = {};
    const cityRegex = /^[A-Za-z ]+$/;
    const stateRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const pinRegex = /^\d{6}$/;

    if (formData.address.trim().length < 5)
      temp.address = "Address must be at least 5 characters long";

    if (!cityRegex.test(formData.city))
      temp.city = "City should contain only alphabets";

    if (!phoneRegex.test(formData.phone))
      temp.phone = "Enter a valid 10-digit phone number starting with 6-9";

    if (!pinRegex.test(formData.postalCode))
      temp.postalCode = "Enter a valid 6-digit postal code";

    if (!formData.country)
      temp.country = "Please select your country";

    if (!stateRegex.test(formData.state))
      temp.state = "State should contain only alphabets";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(saveShipingInfo(formData));
    navigate(`/confrimorder/${id}`);
  };

  return (
    <section className="sec">
      <UserNav />
      <CheckoutSteps step1 />

      <div className="container" style={{ marginTop: "100px" }}>
        <div className="row justify-content-center">
          <div className="col-md-6 rounded shadow p-4 bg-white">
            <h3 className="fw-bold text-center mb-3">Shipping Information</h3>

            <form onSubmit={handleSubmit}>
              {/* Address */}
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className={`form-control ${errors.address && "is-invalid"}`}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              {/* City */}
              <div className="mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className={`form-control ${errors.city && "is-invalid"}`}
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className={`form-control ${errors.phone && "is-invalid"}`}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              {/* Postal Code */}
              <div className="mb-3">
                <label className="form-label">Postal Code</label>
                <input
                  type="number"
                  className={`form-control ${errors.postalCode && "is-invalid"}`}
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                />
                {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
              </div>

              {/* Country */}
              <div className="mb-3">
                <label className="form-label">Country</label>
                <Select
                  options={countryOptions}
                  value={
                    formData.country
                      ? countryOptions.find((c) => c.label === formData.country)
                      : null
                  }
                  onChange={(v) => setFormData({ ...formData, country: v.label })}
                  placeholder="Select your country"
                />
                {errors.country && <small className="text-danger">{errors.country}</small>}
              </div>

              {/* State */}
              <div className="mb-3">
                <label className="form-label">State / Region</label>
                <input
                  type="text"
                  className={`form-control ${errors.state && "is-invalid"}`}
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
                {errors.state && <div className="invalid-feedback">{errors.state}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill fw-semibold"
              >
                Submit & Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shipping;
