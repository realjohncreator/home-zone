"use client";
import React, {useMemo, useState} from "react";
import Container from "@/app/components/Container";
import {useRouter} from "next/navigation";
import useRentModal from "@/app/hooks/useRentModal";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import Modal from "@/app/components/Modals/Modal";
import axios from "axios";
import toast from "react-hot-toast";
import Heading from "@/app/components/Heading";
import {categories} from "@/app/components/Navbar/Categories";
import CategoryInput from "@/app/components/Inputs/CategoryInput";
import CountrySelect from "@/app/components/Inputs/CountrySelect";
import Map from "@/app/components/Map";
import Counter from "@/app/components/Inputs/Counter";
import ImageUpload from "@/app/components/Inputs/ImageUpload";
import Input from "@/app/components/Inputs/Input";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(STEPS.CATEGORY);

    const {register, handleSubmit, watch, setValue, formState: {errors}, reset} = useForm<FieldValues>({
        defaultValues: {
            category: "",
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: "",
            price: 1,
            title: "",
            description: ""
        }
    });

    const category = watch("category");
    const location = watch("location");
    const guestCount = watch("guestCount");
    const roomCount = watch("roomCount");
    const bathroomCount = watch("bathroomCount");
    const imageSrc = watch("imageSrc");

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
    };

    const onBack = () => {
        setStep(step - 1);
    };

    const onNext = () => {
        setStep(step + 1);
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        console.log(data);
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        axios.post("/api/rentListings", data)
            .then(() => {
                toast.success("Listing created successfully");
                router.refresh();
                reset();
                setStep(STEPS.CATEGORY);
                rentModal.onClose();
            })
            .catch((error) => {
                toast.error("Something went wrong");
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return "Create Listing";
        }

        return "Next";
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }

        return "Back";
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="Which of these do you want to rent?" subtitle="Select a category to get started"/>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <div key={item.label}>
                        <CategoryInput
                            icon={item.icon}
                            selected={category === item.label}
                            label={item.label}
                            onClick={(category) => setCustomValue("category", category)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Where do you want to rent?" subtitle="Select a location to get started"/>
                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue("location", value)}
                />
                <Map center={location?.latlng}/>
            </div>
        );
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Let us know more about your listing" subtitle="What facilties are available?"/>
                <Counter
                    title="Guests"
                    subtitle="How many guests are allowed?"
                    value={guestCount}
                    onChange={(value) => setCustomValue("guestCount", value)}
                />
                <hr/>
                <Counter
                    title="Rooms"
                    subtitle="How many rooms are available?"
                    value={roomCount}
                    onChange={(value) => setCustomValue("roomCount", value)}
                />
                <hr/>
                <Counter
                    title="Bathrooms"
                    subtitle="How many bathrooms are available?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue("bathroomCount", value)}
                />
                <hr/>
            </div>
        );
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Add a picture to your listing" subtitle="Show guests what you have available"/>
                <ImageUpload
                    onChange={(value) => setCustomValue("imageSrc", value)}
                    value={imageSrc}
                />
            </div>
        );
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="How would you describe your listing" subtitle="Tell guests what you have available"/>
                
                <Input id="title" label="Title" register={register} errors={errors} required/>
                <hr/>

                <Input id="description" label="Description" register={register} errors={errors} required/>
                <hr/>
            </div>
        );
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="How much do you want to pay?" subtitle="Tell guests what you have available"/>
                <Input formatPrice type="number" id="price" disabled={isLoading} label="Price" register={register}
                       errors={errors} required/>
            </div>
        );
    }

    return (
        <Container>
            <div className="pt-5">
                <Modal
                    title="Create Listing"
                    isOpen={rentModal.isOpen}
                    onClose={rentModal.onClose}
                    onSubmit={handleSubmit(onSubmit)}
                    actionLabel={actionLabel}
                    secondaryActionLabel={secondaryActionLabel}
                    secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
                    body={bodyContent}
                />
            </div>
        </Container>
    );
};

export default RentModal;
